import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

interface Named {
    id: number;
    name: string;
}

interface ManagementUnit {
    id: number;
    path: string;
}

interface CoordinateType {
    id: number;
    typeName: string;
}

interface Coordinate {
    id: number;
    name: string;
    coordinateType: CoordinateType;
}

interface Model {
    officer_nickName: string;
    name: string;
    fatherName: string;
    grandFatherName: string;
    great_grandFather: string;
    officer_sureName: string;

    sourceSymbol: string;
    phoneNumber: string;

    source_officer_mu: ManagementUnit | null;

    country: Named | null;
    city: Named | null;
    district: Named | null;
    handDistrict: Named | null;
    neighbourhood: string;

    coordinates: Coordinate[];
}

@Component({
    selector: 'app-source-officer-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        InputTextModule,
        ButtonModule,
        DividerModule,
        AutoCompleteModule,
        SelectModule,
        DialogModule,
        InputMaskModule
    ],
    templateUrl: './create.html',
    styleUrls: ['./create.scss']
})
export class SourceOfficerCreate {
    submitted = signal(false);

    private readonly managementUnitsMaster: ManagementUnit[] = [
        { id: 10, path: 'العراق / بغداد / الكرخ' },
        { id: 11, path: 'العراق / بغداد / الرصافة' },
        { id: 12, path: 'العراق / بابل / الحلة' }
    ];

    muSuggestions = signal<ManagementUnit[]>([]);

    countries: Named[] = [
        { id: 1, name: 'العراق' },
        { id: 2, name: 'سوريا' }
    ];

    private readonly citiesAll: Array<Named & { countryId: number }> = [
        { id: 1, name: 'بغداد', countryId: 1 },
        { id: 2, name: 'نينوى', countryId: 1 },
        { id: 3, name: 'دمشق', countryId: 2 }
    ];

    private readonly districtsAll: Array<Named & { cityId: number }> = [
        { id: 1, name: 'الكرخ', cityId: 1 },
        { id: 2, name: 'الرصافة', cityId: 1 },
        { id: 3, name: 'الموصل', cityId: 2 }
    ];

    private readonly handDistrictsAll: Array<Named & { districtId: number }> = [
        { id: 1, name: 'المنصور', districtId: 1 },
        { id: 2, name: 'الجامعة', districtId: 1 },
        { id: 3, name: 'حي النور', districtId: 3 }
    ];

    coordinateTypes: CoordinateType[] = [
        { id: 1, typeName: 'GPS' },
        { id: 2, typeName: 'UTM' }
    ];

    private coordinatesMaster: Coordinate[] = [
        { id: 1, name: '12A AA 12345 12345', coordinateType: { id: 1, typeName: 'GPS' } },
        { id: 2, name: '13B BB 23456 23456', coordinateType: { id: 2, typeName: 'UTM' } }
    ];

    coordinateSuggestions = signal<Coordinate[]>([]);

    model = signal<Model>({
        officer_nickName: '',
        name: '',
        fatherName: '',
        grandFatherName: '',
        great_grandFather: '',
        officer_sureName: '',
        sourceSymbol: '',
        phoneNumber: '',
        source_officer_mu: null,
        country: null,
        city: null,
        district: null,
        handDistrict: null,
        neighbourhood: '',
        coordinates: []
    });

    selectedCoordinates: Coordinate[] = [];

    citiesFiltered = computed(() => {
        const countryId = this.model().country?.id;
        if (!countryId) return [];
        return this.citiesAll.filter((c) => c.countryId === countryId).map(({ id, name }) => ({ id, name }));
    });

    districtsFiltered = computed(() => {
        const cityId = this.model().city?.id;
        if (!cityId) return [];
        return this.districtsAll.filter((d) => d.cityId === cityId).map(({ id, name }) => ({ id, name }));
    });

    handDistrictsFiltered = computed(() => {
        const districtId = this.model().district?.id;
        if (!districtId) return [];
        return this.handDistrictsAll.filter((h) => h.districtId === districtId).map(({ id, name }) => ({ id, name }));
    });

    coordinateDialog = false;
    coordinateSubmitted = false;
    coordinateDraftName = '';
    coordinateDraftType: CoordinateType | null = null;

    sanitizePhone(): void {
        const cleaned = (this.model().phoneNumber || '').replace(/[^0-9+]/g, '');
        this.model.update((m) => ({ ...m, phoneNumber: cleaned }));
    }

    filterMu(event: AutoCompleteCompleteEvent): void {
        const q = (event.query || '').trim().toLowerCase();
        if (q.length < 3) {
            this.muSuggestions.set([]);
            return;
        }
        this.muSuggestions.set(this.managementUnitsMaster.filter((m) => m.path.toLowerCase().includes(q)).slice(0, 20));
    }

    onCountryChange(): void {
        this.model.update((m) => ({ ...m, city: null, district: null, handDistrict: null }));
    }

    onCityChange(): void {
        this.model.update((m) => ({ ...m, district: null, handDistrict: null }));
    }

    onDistrictChange(): void {
        this.model.update((m) => ({ ...m, handDistrict: null }));
    }

    filterCoordinates(event: AutoCompleteCompleteEvent): void {
        const q = (event.query || '').trim().toLowerCase();
        if (q.length < 3) {
            this.coordinateSuggestions.set([]);
            return;
        }

        this.coordinateSuggestions.set(this.coordinatesMaster.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 20));
    }

    openCoordinateDialog(): void {
        this.coordinateSubmitted = false;
        this.coordinateDraftName = '';
        this.coordinateDraftType = null;
        this.coordinateDialog = true;
    }

    saveCoordinate(): void {
        this.coordinateSubmitted = true;

        const name = (this.coordinateDraftName || '').trim();
        if (!name || !this.coordinateDraftType) return;

        const nextId = this.nextId(this.coordinatesMaster);
        const newItem: Coordinate = { id: nextId, name, coordinateType: this.coordinateDraftType };
        this.coordinatesMaster = [...this.coordinatesMaster, newItem];

        this.selectedCoordinates = [...this.selectedCoordinates, newItem];
        this.coordinateDialog = false;
    }

    save(): void {
        this.submitted.set(true);

        const m = this.model();
        const requiredOk =
            !!m.officer_nickName.trim() &&
            !!m.name.trim() &&
            !!m.fatherName.trim() &&
            !!m.grandFatherName.trim() &&
            !!m.great_grandFather.trim() &&
            !!m.officer_sureName.trim() &&
            !!m.sourceSymbol.trim() &&
            !!m.phoneNumber.trim() &&
            !!m.source_officer_mu &&
            !!m.country;

        if (!requiredOk) return;

        this.model.update((x) => ({ ...x, coordinates: [...this.selectedCoordinates] }));
        // UI-first: no API yet
    }

    private nextId<T extends { id: number }>(items: T[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) maxId = item.id;
        }
        return maxId + 1;
    }
}
