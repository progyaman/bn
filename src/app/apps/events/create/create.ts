import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { EventTypeSidebarComponent } from '../event-type-sidebar.component';
import * as L from 'leaflet';

interface CreateEventModel {
    typeThreat?: string;
    activityType?: string;
    date?: Date | null;
    time?: Date | null;
    durationHours?: number | null;
    otherHands?: string[];
    missionName?: string;
    organization?: string;
    typeOrgNames?: string[];
    tab3yeaAlMonjaz?: string;
    requestMu?: string;
    targetEntity?: string;
    destinationKm?: number | null;
    theNews?: string;
    targets?: string[];
    sourceMu?: string;
    numberBook?: string;
    nameAdditionArms?: string;
    typeArms?: string;
    additionArms?: string;
    holdingForces?: string[];
    coordinates: string[];
    locationRows?: LocationRow[];
}

interface LocationRow {
    id: number;
    coords: string;
    path: string;
}

interface DraftEntry {
    id: string;
    timestamp: Date;
    missionName?: string;
    newsPreview?: string;
    model: CreateEventModel;
}

interface AttachmentRow {
    name: string;
    mimeType?: string;
    file?: File;
    objectUrl?: string;
}

@Component({
    selector: 'app-create-event',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        DatePickerModule,
        FileUploadModule,
        AutoCompleteModule,
        MultiSelectModule,
        InputNumberModule,
        TableModule,
        TooltipModule,
        DialogModule,
        ToastModule,
        TagModule,
        EventTypeSidebarComponent
    ],
    providers: [MessageService],
    templateUrl: './create.html',
    styleUrls: ['./create.scss']
})
export class CreateEvent implements OnInit, AfterViewInit {
    @ViewChild('mapContainer') mapElement!: ElementRef;
    map!: L.Map;
    marker?: L.Marker;

    showMap = true;
    showDrafts = false;
    isMegaMenuOpen = false;
    selectedEventType = '';
    selectedIcon = '';
    activeDraftId: string | null = null;

    locationPath = '';
    locationRows: LocationRow[] = [];

    eventTypes = [
        { label: 'نشاط أمني', description: 'توثيق الأنشطة والعمليات الأمنية الميدانية والمهمات الخاصة', icon: 'pi pi-shield', color: '#ffc107' },
        { label: 'تقرير موضوعي', description: 'تقييم شامل لموضوع محدد مع التحليل والتوصيات', icon: 'pi pi-file-edit', color: '#03a9f4' },
        { label: 'تقرير جزئي', description: 'تحديثات سريعة وتقارير مختصرة عن حالة معينة', icon: 'pi pi-list', color: '#4caf50' },
        { label: 'برقية إخبارية', description: 'إبلاغ سريع عن حدث طارئ أو معلومة فورية', icon: 'pi pi-send', color: '#f44336' },
        { label: 'محضر تحقيق', description: 'توثيق رسمي للافتادات ووقائع التحقيق والمحاضر', icon: 'pi pi-user-edit', color: '#9c27b0' },
        { label: 'نشاط تدريبي', description: 'سجلات الدورات، الممارسة الميدانية، والتدريب المشترك', icon: 'pi pi-book', color: '#795548' },
        { label: 'إضافة هدف', description: 'تعريف أهداف جديدة في النظام وتحديد المعالم', icon: 'pi pi-map-marker', color: '#607d8b' }
    ];

    model: CreateEventModel = {
        date: null,
        time: null,
        durationHours: null,
        destinationKm: null,
        coordinates: []
    };

    attachments: AttachmentRow[] = [];
    drafts: DraftEntry[] = [];

    activityTypes = ['مكافحة ارها ب', 'جريمة منظمة', 'أمن داخلي'];
    missionNames = ['عملية البرق', 'مهمة الفجر', 'المراقبة المستمرة'];
    organizationOptions = ['قيادة اليرموك', 'مركز الرشيد', 'مكتب '];
    typeOrgNameOptions = ['مداهمة', 'تفتيش', 'كمين', 'استطلاع'];
    tab3yeaOptions = ['قوة أمنية', 'مشترك', 'مدني', 'بناء تحتي'];
    otherHandsOptions = ['التحالف الدولي', 'الحشد الشعبي', 'الدفاع المدني'];
    targetOptions = ['منزل مشبوه', 'مخزن سلاح', 'عجلة مستهدفة'];

    nameAdditionOptions = ['ميداني', 'فني', 'بشري'];
    typeArmsOptions = ['سلاح خفيف', 'متفجرات', 'أجهزة اتصال'];
    additionArmsOptions = ['AK47', 'C4', 'Radio-X'];
    holdingForceOptions = ['اللواء 15', 'الشرطة المحلية', 'أمن المنطقة'];

    requestMuSuggestions: string[] = [];
    private allRequestMu = ['جهاز مكافحة الارها ب', 'وزارة الداخلية', 'العمليات المشتركة'];
    sourceMuSuggestions: string[] = [];
    private allSourceMu = [' العسكرية', 'الأمن الوطني'];

    constructor(
        private route: ActivatedRoute,
        private messageService: MessageService,
        private cd: ChangeDetectorRef
    ) {
        this.loadDraftsFromStorage();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const typeLabel = params['type'];
            if (typeLabel) {
                const typeObj = this.eventTypes.find(t => t.label === typeLabel);
                if (typeObj) {
                    this.selectedEventType = typeObj.label;
                    this.selectedIcon = typeObj.icon;
                    this.cd.detectChanges();
                }
            }
        });
    }

    ngAfterViewInit() {
        if (this.showMap) {
            setTimeout(() => this.initMap(), 500);
        }
    }

    private loadDraftsFromStorage() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = localStorage.getItem('bn_event_drafts');
            if (saved) {
                try {
                    this.drafts = JSON.parse(saved);
                } catch (e) {
                    this.drafts = [];
                }
            }
        }
    }

    private saveDraftsToStorage() {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('bn_event_drafts', JSON.stringify(this.drafts));
        }
    }

    onSaveDraft() {
        if (this.calcProgress() < 100) {
            this.messageService.add({
                severity: 'warn',
                summary: 'نموذج غير مكتمل',
                detail: 'يرجى إكمال جميع الحقول الإلزامية لتصل نسبة الاكتمال إلى 100% قبل الحفظ كمسودة.'
            });
            return;
        }

        const modelToSave = { 
            ...this.model, 
            locationRows: this.locationRows 
        };

        const newDraft: DraftEntry = {
            id: Date.now().toString(),
            timestamp: new Date(),
            missionName: this.model.missionName,
            newsPreview: this.model.theNews?.substring(0, 100),
            model: modelToSave
        };

        this.drafts.unshift(newDraft);
        this.saveDraftsToStorage();
        this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم حفظ المسودة بنجاح' });
        
        this.resetForm();
    }

    loadDraft(draft: DraftEntry) {
        this.model = { ...draft.model };
        this.activeDraftId = draft.id;
        this.locationRows = draft.model.locationRows || [];
        // Convert date strings back to Date objects if needed
        if (this.model.date) this.model.date = new Date(this.model.date);
        if (this.model.time) this.model.time = new Date(this.model.time);
        
        this.showDrafts = false;
        
        if (this.model.coordinates && this.model.coordinates.length === 2 && this.map) {
            const lat = parseFloat(this.model.coordinates[0]);
            const lng = parseFloat(this.model.coordinates[1]);
            this.setMarker(L.latLng(lat, lng));
            this.map.panTo([lat, lng]);
        }
        
        this.messageService.add({ severity: 'success', summary: 'تم الاسترجاع', detail: 'تم تحميل بيانات المسودة' });
    }

    deleteDraft(draft: DraftEntry) {
        this.drafts = this.drafts.filter(d => d.id !== draft.id);
        this.saveDraftsToStorage();
    }

    toggleMegaMenu() { this.isMegaMenuOpen = !this.isMegaMenuOpen; }
    openMegaMenu() { this.isMegaMenuOpen = true; }
    closeMegaMenu() { this.isMegaMenuOpen = false; }

    selectEventType(type: any) {
        this.selectedEventType = type.label;
        this.selectedIcon = type.icon;
        this.isMegaMenuOpen = false;
        console.log('Selected Type:', type);
    }

    toggleMap() {
        this.showMap = !this.showMap;
        if (this.showMap) {
            setTimeout(() => {
                if (!this.map) this.initMap();
                else this.map.invalidateSize();
            }, 450);
        }
    }

    private initMap() {
        const iconDefault = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;
        this.map = L.map(this.mapElement.nativeElement).setView([33.3152, 44.3661], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
        this.map.on('click', (e: any) => this.setMarker(e.latlng));

        if (this.model.coordinates && this.model.coordinates.length === 2) {
            const lat = parseFloat(this.model.coordinates[0]);
            const lng = parseFloat(this.model.coordinates[1]);
            this.setMarker(L.latLng(lat, lng));
        }
    }

    private setMarker(latlng: L.LatLng) {
        if (this.marker) this.marker.setLatLng(latlng);
        else {
            this.marker = L.marker(latlng, { draggable: true }).addTo(this.map);
            this.marker.on('dragend', () => {
                const pos = this.marker!.getLatLng();
                this.onMarkerUpdate(pos);
            });
        }
        this.onMarkerUpdate(latlng);
    }

    private onMarkerUpdate(latlng: L.LatLng) {
        this.model.coordinates = [latlng.lat.toFixed(6), latlng.lng.toFixed(6)];
        this.reverseGeocode(latlng.lat, latlng.lng);
    }

    private async reverseGeocode(lat: number, lng: number) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`);
            const data = await response.json();
            if (data && data.display_name) {
                const parts = data.display_name.split(',').map((p: string) => p.trim());
                const path = parts.slice(0, 4).reverse().join(', ');
                this.locationPath = path;
                this.cd.detectChanges();
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    }

    addLocationToTable() {
        if (!this.locationPath || this.model.coordinates.length < 2) return;
        
        const coords = `${this.model.coordinates[0]}, ${this.model.coordinates[1]}`;
        
        // Prevent duplicate consecutive entries with same coords
        const last = this.locationRows[this.locationRows.length - 1];
        if (!last || last.coords !== coords) {
            this.locationRows.push({
                id: Date.now(),
                coords: coords,
                path: this.locationPath
            });
            this.messageService.add({ severity: 'success', summary: 'تمت الإضافة', detail: 'تم إضافة الموقع للجدول' });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'تكرار', detail: 'هذا الموقع مضاف بالفعل في الجدول' });
        }
        this.cd.detectChanges();
    }

    removeLocationRow(row: LocationRow) {
        this.locationRows = this.locationRows.filter(r => r.id !== row.id);
    }

    filterRequestMu(event: any) {
        this.requestMuSuggestions = this.allRequestMu.filter(x => x.includes(event.query));
    }

    filterSourceMu(event: any) {
        this.sourceMuSuggestions = this.allSourceMu.filter(x => x.includes(event.query));
    }

    requiresTypeArms(val: any) { return val === 'فني' || val === 'بشري'; }

    getFileIcon(mime?: string) {
        if (mime?.includes('image')) return 'pi pi-image';
        return 'pi pi-file';
    }

    onFilesSelected(event: any) {
        for (let file of event.files) {
            this.attachments.push({ name: file.name, mimeType: file.type, objectUrl: URL.createObjectURL(file) });
        }
    }

    downloadAttachment(row: any) { window.open(row.objectUrl); }
    viewAttachment(row: any) { window.open(row.objectUrl, '_blank'); }
    removeAttachment(row: any) { this.attachments = this.attachments.filter(x => x !== row); }

    calcProgress(): number {
        const fields = [this.model.activityType, this.model.missionName, this.model.theNews, this.model.sourceMu];
        return Math.round((fields.filter(f => !!f).length / fields.length) * 100);
    }

    onSave() {
        if (this.calcProgress() < 100) {
            this.messageService.add({
                severity: 'warn',
                summary: 'نموذج غير مكتمل',
                detail: 'يرجى إكمال جميع الحقول الإلزامية لتصل نسبة الاكتمال إلى 100% قبل الحفظ.'
            });
            return;
        }

        const dataToSave = {
            ...this.model,
            locationRows: this.locationRows
        };

        console.log('Save', dataToSave);

        // If this was loaded from a draft, remove it from the drafts table
        if (this.activeDraftId) {
            this.drafts = this.drafts.filter(d => d.id !== this.activeDraftId);
            this.saveDraftsToStorage();
            this.activeDraftId = null;
        }

        this.messageService.add({
            severity: 'success',
            summary: 'تم بنجاح',
            detail: 'تم حفظ الحدث بنجاح وتمت إزالة المسودة'
        });
        this.resetForm();
    }

    private resetForm() {
        this.model = {
            date: null,
            time: null,
            durationHours: null,
            destinationKm: null,
            coordinates: []
        };
        this.locationRows = [];
        this.locationPath = '';
        this.attachments = [];
        this.activeDraftId = null;
        this.selectedEventType = '';
        this.selectedIcon = '';
        
        if (this.marker) {
            this.marker.remove();
            this.marker = undefined;
        }
        
        if (this.map) {
            this.map.setView([33.3152, 44.3661], 6);
        }
        this.cd.detectChanges();
    }

    onOpenSeizure() {}
    onOpenResults() {}
    onOpenAddTarget() {}
    handleEventTypeAction(action: any) {}
}
