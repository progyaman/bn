import { CommonModule } from '@angular/common';
import { Component, computed, signal, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'primeng/api';
import * as L from 'leaflet';

type ArmsKind = 'فني' | 'مصدر بشري';

type Reliability = 'غير موثوق' | 'ضعيف' | 'متوسط' | 'موثوق';

type ActiveState = 'فعال' | 'غير فعال';

interface Option {
    label: string;
    value: string;
}

interface SecurityFile {
    id: number;
    name: string;
}

interface SourceOfficer {
    id: number;
    sourceSymbol: string;
}

interface ManagementUnit {
    id: number;
    path: string;
}

interface UploadedFileRow {
    name: string;
    type?: string;
}

interface LocationRow {
    id: number;
    type: 'spreading' | 'residential';
    coords: string;
    path: string;
}

interface SpreadingPlaceRow {
    id: number;
    country?: string;
    city?: string;
    district?: string;
    handDistrict?: string;
    neighbourhood?: string;
}

interface Model {
    armsKind: ArmsKind | null;
    typeArms: string | null;

    dependencyMu: ManagementUnit | null;

    firstSymbol: string;
    reliability: Reliability | null;
    state: ActiveState | null;

    securityFiles: SecurityFile[];
    sourceOfficer: SourceOfficer | null;

    // human info
    nickName: string;
    firstName: string;
    secondName: string;
    thirdName: string;
    fourthName: string;
    sureName: string;
    fullMotherName: string;
    motherSureName: string;
    secondSymbol: string;
    phoneNumbers: string;

    note: string;
}

@Component({
    selector: 'app-addition-arms-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SelectModule,
        MultiSelectModule,
        InputTextModule,
        TextareaModule,
        AutoCompleteModule,
        ButtonModule,
        DividerModule,
        FileUploadModule,
        TableModule,
        DialogModule,
        TooltipModule,
        ColorPickerModule,
        SharedModule
    ],
    templateUrl: './create.html',
    styleUrls: ['./create.scss']
})
export class AdditionArmsCreate implements AfterViewInit {
    @ViewChild('mapContainer') mapElement!: ElementRef;
    
    constructor(private cd: ChangeDetectorRef) {}

    map!: L.Map;
    spreadingMarker?: L.Marker;
    residentialMarker?: L.Marker;

    showMap = true;
    locationMode = signal<'spreading' | 'residential'>('spreading');
    mapCoordinates = signal<string[]>([]); // for spreading
    residentialCoords = signal<string[]>([]);
    spreadingPath = signal<string>('');
    residentialPath = signal<string>('');
    locationRows = signal<LocationRow[]>([]);

    submitted = signal(false);

    typeArmsDialog = false;
    typeArmsDraftName = '';
    typeArmsSubmitted = false;

    armsKinds: Option[] = [
        { label: 'فني', value: 'فني' },
        { label: 'مصدر بشري', value: 'مصدر بشري' }
    ];

    private typeArmsByKind = signal<Record<string, Option[]>>({
        فني: [
            { label: 'نوع فني 1', value: 'نوع فني 1' },
            { label: 'نوع فني 2', value: 'نوع فني 2' }
        ],
        'مصدر بشري': [
            { label: 'نوع بشري 1', value: 'نوع بشري 1' },
            { label: 'نوع بشري 2', value: 'نوع بشري 2' }
        ]
    });

    typeArmsOptions = computed<Option[]>(() => {
        const kind = this.model().armsKind;
        if (!kind) return [];
        return this.typeArmsByKind()[kind] ?? [];
    });

    reliabilityOptions: Option[] = [
        { label: 'غير موثوق', value: 'غير موثوق' },
        { label: 'ضعيف', value: 'ضعيف' },
        { label: 'متوسط', value: 'متوسط' },
        { label: 'موثوق', value: 'موثوق' }
    ];

    stateOptions: Option[] = [
        { label: 'فعال', value: 'فعال' },
        { label: 'غير فعال', value: 'غير فعال' }
    ];

    securityFiles: SecurityFile[] = [
        { id: 1, name: 'الملف العسكري 1' },
        { id: 2, name: 'الملف العسكري 2' },
        { id: 3, name: 'الملف العسكري 3' }
    ];

    sourceOfficers: SourceOfficer[] = [
        { id: 1, sourceSymbol: 'SO-001' },
        { id: 2, sourceSymbol: 'SO-002' }
    ];

    private managementUnits: ManagementUnit[] = [
        { id: 1, path: 'العراق / بغداد / الكرخ' },
        { id: 2, path: 'العراق / بغداد / الرصافة' },
        { id: 3, path: 'العراق / الانبار / الرمادي' },
        { id: 4, path: 'العراق / نينوى / الموصل' }
    ];

    muSuggestions = signal<ManagementUnit[]>([]);

    ngAfterViewInit() {
        if (this.showMap) {
            setTimeout(() => this.initMap(), 500);
        }
    }

    toggleMap() {
        this.showMap = !this.showMap;
        if (this.showMap) {
            setTimeout(() => {
                if (!this.map) {
                    this.initMap();
                } else {
                    this.map.invalidateSize();
                }
            }, 450);
        }
    }

    private initMap() {
        const iconDefault = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;

        const defaultCenter: L.LatLngExpression = [33.3152, 44.3661];

        this.map = L.map(this.mapElement.nativeElement, {
            center: defaultCenter,
            zoom: 6
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            this.setMarker(e.latlng);
        });

        if (this.mapCoordinates().length === 2) {
            const lat = parseFloat(this.mapCoordinates()[0]);
            const lng = parseFloat(this.mapCoordinates()[1]);
            this.setMarker(L.latLng(lat, lng));
        }
    }

    private setMarker(latlng: L.LatLng) {
        const mode = this.locationMode();
        
        if (mode === 'spreading') {
            if (this.spreadingMarker) {
                this.spreadingMarker.setLatLng(latlng);
            } else {
                this.spreadingMarker = L.marker(latlng, { draggable: true }).addTo(this.map);
                this.spreadingMarker.on('dragend', () => {
                   this.onMarkerUpdate('spreading', this.spreadingMarker!.getLatLng());
                });
            }
            this.onMarkerUpdate('spreading', latlng);
        } else {
            const iconOrange = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });
            if (this.residentialMarker) {
                this.residentialMarker.setLatLng(latlng);
            } else {
                this.residentialMarker = L.marker(latlng, { draggable: true, icon: iconOrange }).addTo(this.map);
                this.residentialMarker.on('dragend', () => {
                   this.onMarkerUpdate('residential', this.residentialMarker!.getLatLng());
                });
            }
            this.onMarkerUpdate('residential', latlng);
        }
    }

    private onMarkerUpdate(mode: 'spreading' | 'residential', latlng: L.LatLng) {
        const coords = [latlng.lat.toFixed(6), latlng.lng.toFixed(6)];
        if (mode === 'spreading') {
            this.mapCoordinates.set(coords);
            this.reverseGeocode(latlng.lat, latlng.lng, 'spreading');
        } else {
            this.residentialCoords.set(coords);
            this.reverseGeocode(latlng.lat, latlng.lng, 'residential');
        }
    }

    private async reverseGeocode(lat: number, lng: number, mode: 'spreading' | 'residential') {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`);
            const data = await response.json();
            if (data && data.display_name) {
                const parts = data.display_name.split(',').map((p: string) => p.trim());
                const path = parts.slice(0, 4).reverse().join(', ');
                
                const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                
                // Add to table
                this.locationRows.update(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        type: mode,
                        coords: coords,
                        path: path
                    }
                ]);

                if (mode === 'spreading') {
                    this.spreadingPath.set(path);
                } else {
                    this.residentialPath.set(path);
                }
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    }

    resetMap() {
        if (this.spreadingMarker) {
            this.map.removeLayer(this.spreadingMarker);
            this.spreadingMarker = undefined;
            this.mapCoordinates.set([]);
            this.spreadingPath.set('');
        }
        if (this.residentialMarker) {
            this.map.removeLayer(this.residentialMarker);
            this.residentialMarker = undefined;
            this.residentialCoords.set([]);
            this.residentialPath.set('');
        }
        this.locationRows.set([]);
        this.map.setView([33.3152, 44.3661], 6);
    }

    removeLocationRow(row: LocationRow) {
        this.locationRows.update(prev => prev.filter(r => r.id !== row.id));
    }

    // uploads
    uploads = signal<UploadedFileRow[]>([]);

    model = signal<Model>({
        armsKind: null,
        typeArms: null,
        dependencyMu: null,
        firstSymbol: '',
        reliability: null,
        state: null,
        securityFiles: [],
        sourceOfficer: null,
        nickName: '',
        firstName: '',
        secondName: '',
        thirdName: '',
        fourthName: '',
        sureName: '',
        fullMotherName: '',
        motherSureName: '',
        secondSymbol: '',
        phoneNumbers: '',
        note: ''
    });

    onSave(): void {
        this.submitted.set(true);

        const m = this.model();
        const data = {
            ...m,
            spreadingCoords: this.mapCoordinates(),
            spreadingPath: this.spreadingPath(),
            residentialCoords: this.residentialCoords(),
            residentialPath: this.residentialPath(),
            locationHistory: this.locationRows(),
            attachments: this.uploads()
        };

        if (!m.armsKind) return;
        if (!m.typeArms) return;
        if (!m.firstSymbol.trim()) return;
        if (!m.secondSymbol.trim()) return;
        if (!m.reliability) return;
        if (!m.state) return;
        if (!m.sourceOfficer) return;

        // UI-first: no API call yet.
        console.log('Save Addition Arms:', data);
    }

    onSaveDraft(): void {
        const data = {
            ...this.model(),
            spreadingCoords: this.mapCoordinates(),
            spreadingPath: this.spreadingPath(),
            residentialCoords: this.residentialCoords(),
            residentialPath: this.residentialPath(),
            locationHistory: this.locationRows(),
            attachments: this.uploads()
        };
        console.log('Saved as draft:', data);
    }

    onArmsKindChanged(): void {
        this.model.update((m) => ({
            ...m,
            typeArms: null,
            dependencyMu: null,
            securityFiles: m.armsKind === 'فني' ? [] : m.securityFiles
        }));
    }

    openTypeArmsDialog(): void {
        this.typeArmsDraftName = '';
        this.typeArmsSubmitted = false;
        this.typeArmsDialog = true;
    }

    removeSelectedTypeArms(): void {
        const kind = this.model().armsKind;
        const selected = this.model().typeArms;
        if (!kind || !selected) return;

        this.typeArmsByKind.update((map) => {
            const current = map[kind] ?? [];
            return {
                ...map,
                [kind]: current.filter((o) => o.value !== selected)
            };
        });

        this.model.update((m) => ({ ...m, typeArms: null }));
    }

    closeTypeArmsDialog(): void {
        this.typeArmsDialog = false;
        this.typeArmsSubmitted = false;
    }

    saveTypeArms(): void {
        this.typeArmsSubmitted = true;
        const name = (this.typeArmsDraftName || '').trim();
        const kind = this.model().armsKind;
        if (!name || !kind) return;

        this.typeArmsByKind.update((map) => {
            const current = map[kind] ?? [];
            if (current.some((o) => o.value === name)) return map;
            return {
                ...map,
                [kind]: [...current, { label: name, value: name }]
            };
        });

        this.model.update((m) => ({ ...m, typeArms: name }));
        this.typeArmsDialog = false;
    }

    searchMu(event: AutoCompleteCompleteEvent): void {
        const query = (event.query || '').trim();
        if (query.length < 3) {
            this.muSuggestions.set([]);
            return;
        }

        const lowered = query.toLowerCase();
        this.muSuggestions.set(this.managementUnits.filter((m) => m.path.toLowerCase().includes(lowered)).slice(0, 20));
    }

    normalizePhone(event: Event): void {
        const input = event.target as HTMLInputElement | null;
        if (!input) return;
        input.value = input.value.replace(/[^0-9+\-\s]/g, '');
        this.model.update((m) => ({ ...m, phoneNumbers: input.value }));
    }

    onFilesSelected(event: any): void {
        const files = event.files || event.currentFiles || [];
        if (files && files.length > 0) {
            const newRows: UploadedFileRow[] = Array.from(files).map((f: any) => ({
                name: f.name,
                type: f.type
            }));
            this.uploads.update(current => [...current, ...newRows]);
            this.cd.detectChanges();
        }
    }

    removeUpload(row: UploadedFileRow): void {
        this.uploads.update(list => list.filter((it) => it !== row));
    }

    private nextId<T extends { id: number }>(items: T[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) maxId = item.id;
        }
        return maxId + 1;
    }

    calcProgress(): number {
        const m = this.model();
        const fields = [
            m.armsKind,
            m.typeArms,
            m.firstSymbol,
            m.reliability,
            m.state,
            m.sourceOfficer,
            m.firstName,
            m.secondName,
            m.thirdName
        ];

        if (m.armsKind === 'مصدر بشري') {
            fields.push(m.secondSymbol);
        }

        const filled = fields.filter((f) => {
            if (typeof f === 'string') return f.trim().length > 0;
            return !!f;
        }).length;

        // Add map and paths
        const hasSpreading = this.mapCoordinates().length === 2 && this.spreadingPath().length > 0;
        const hasResidential = this.residentialCoords().length === 2 && this.residentialPath().length > 0;
        
        const totalFields = fields.length + 2;
        const totalFilled = filled + (hasSpreading ? 1 : 0) + (hasResidential ? 1 : 0);

        return Math.round((totalFilled / totalFields) * 100);
    }
}
