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
    template: `
        <div class="card" dir="rtl">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">ضابط المصدر</div>
                    <div class="flex flex-wrap gap-2">
                        <p-button label="حفظ" icon="pi pi-save" severity="success" (onClick)="save()" />
                        <p-button label="إلغاء" icon="pi pi-times" severity="secondary" [text]="true" [routerLink]="['/apps/additionArms/sourceOfficer/list']" />
                    </div>
                </div>

                <div class="card mb-0">
                    <div class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">معلومات ضابط المصدر</div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-3">
                            <label class="block font-medium mb-2">الكنية</label>
                            <input pInputText class="w-full" [(ngModel)]="model().officer_nickName" />
                            <small class="text-red-500" *ngIf="submitted() && !model().officer_nickName.trim()">يرجى ملئ حقل الكنية</small>
                        </div>
                        <div class="col-span-12 md:col-span-3">
                            <label class="block font-medium mb-2">الأسم</label>
                            <input pInputText class="w-full" [(ngModel)]="model().name" />
                            <small class="text-red-500" *ngIf="submitted() && !model().name.trim()">يرجى ملئ حقل الاسم</small>
                        </div>
                        <div class="col-span-12 md:col-span-3">
                            <label class="block font-medium mb-2">أسم الاب</label>
                            <input pInputText class="w-full" [(ngModel)]="model().fatherName" />
                            <small class="text-red-500" *ngIf="submitted() && !model().fatherName.trim()">يرجى ملئ حقل اسم الأب</small>
                        </div>
                        <div class="col-span-12 md:col-span-3">
                            <label class="block font-medium mb-2">أسم الجد</label>
                            <input pInputText class="w-full" [(ngModel)]="model().grandFatherName" />
                            <small class="text-red-500" *ngIf="submitted() && !model().grandFatherName.trim()">يرجى ملئ حقل اسم الجد</small>
                        </div>

                        <div class="col-span-12 md:col-span-3">
                            <label class="block font-medium mb-2">أسم الرابع</label>
                            <input pInputText class="w-full" [(ngModel)]="model().great_grandFather" />
                            <small class="text-red-500" *ngIf="submitted() && !model().great_grandFather.trim()">يرجى ملئ حقل الاسم</small>
                        </div>
                        <div class="col-span-12 md:col-span-3">
                            <label class="block font-medium mb-2">اللقب</label>
                            <input pInputText class="w-full" [(ngModel)]="model().officer_sureName" />
                            <small class="text-red-500" *ngIf="submitted() && !model().officer_sureName.trim()">يرجى ملئ حقل اللقب</small>
                        </div>
                        <div class="col-span-12 md:col-span-3">
                            <label class="block font-medium mb-2">رمز ضابط المصدر</label>
                            <input pInputText class="w-full" [(ngModel)]="model().sourceSymbol" />
                            <small class="text-red-500" *ngIf="submitted() && !model().sourceSymbol.trim()">يرجى ملئ حقل الرمز</small>
                        </div>
                        <div class="col-span-12 md:col-span-3">
                            <label class="block font-medium mb-2">رقم الهاتف</label>
                            <input
                                pInputText
                                class="w-full"
                                [(ngModel)]="model().phoneNumber"
                                inputmode="numeric"
                                (input)="sanitizePhone()"
                                maxlength="11"
                                placeholder="أدخل رقم الهاتف"
                            />
                            <small class="text-red-500" *ngIf="submitted() && !model().phoneNumber.trim()">يرجى ملئ حقل رقم الهاتف</small>
                        </div>

                        <div class="col-span-12 md:col-span-6">
                            <div class="flex items-center gap-2 mb-2">
                                <label class="block font-medium">العائدية</label>
                                <p-button icon="pi pi-info" [rounded]="true" [text]="true" />
                            </div>
                            <p-autocomplete
                                [(ngModel)]="model().source_officer_mu"
                                [suggestions]="muSuggestions()"
                                (completeMethod)="filterMu($event)"
                                [dropdown]="true"
                                [forceSelection]="true"
                                [minLength]="3"
                                optionLabel="path"
                                placeholder="بحث... يبدء من سلسلة 3"
                                class="w-full"
                            />
                            <small class="text-red-500" *ngIf="submitted() && !model().source_officer_mu">يرجى ملئ حقل العائدية</small>
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    <div class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">منطقة الانتشار</div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-4">
                            <label class="block font-medium mb-2">الدولة</label>
                            <p-select
                                [(ngModel)]="model().country"
                                [options]="countries"
                                optionLabel="name"
                                placeholder="يرجى الأختيار"
                                class="w-full"
                                (onChange)="onCountryChange()"
                            />
                            <small class="text-red-500" *ngIf="submitted() && !model().country">يرجى ملئ حقل الدولة</small>
                        </div>

                        <div class="col-span-12 md:col-span-4">
                            <label class="block font-medium mb-2">المحافظة</label>
                            <p-select
                                [(ngModel)]="model().city"
                                [options]="citiesFiltered()"
                                optionLabel="name"
                                placeholder="يرجى الأختيار"
                                class="w-full"
                                (onChange)="onCityChange()"
                                [showClear]="true"
                            />
                        </div>

                        <div class="col-span-12 md:col-span-4">
                            <label class="block font-medium mb-2">القضاء</label>
                            <p-select
                                [(ngModel)]="model().district"
                                [options]="districtsFiltered()"
                                optionLabel="name"
                                placeholder="يرجى الأختيار"
                                class="w-full"
                                (onChange)="onDistrictChange()"
                                [showClear]="true"
                            />
                        </div>

                        <div class="col-span-12 md:col-span-4">
                            <label class="block font-medium mb-2">الناحية</label>
                            <p-select
                                [(ngModel)]="model().handDistrict"
                                [options]="handDistrictsFiltered()"
                                optionLabel="name"
                                placeholder="يرجى الأختيار"
                                class="w-full"
                                [showClear]="true"
                            />
                        </div>

                        <div class="col-span-12 md:col-span-4">
                            <label class="block font-medium mb-2">المنطقة</label>
                            <input pInputText class="w-full" [(ngModel)]="model().neighbourhood" maxlength="250" />
                        </div>

                        <div class="col-span-12">
                            <div class="flex items-center justify-between gap-2 mb-2">
                                <label class="block font-medium">الأحداثي الجغرافي</label>
                                <p-button icon="pi pi-plus" label="إضافة" (onClick)="openCoordinateDialog()" />
                            </div>

                            <p-autocomplete
                                [(ngModel)]="selectedCoordinates"
                                [suggestions]="coordinateSuggestions()"
                                (completeMethod)="filterCoordinates($event)"
                                [dropdown]="true"
                                [multiple]="true"
                                optionLabel="name"
                                [minLength]="3"
                                placeholder="بحث... يبدء من سلسلة 3"
                                class="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <p-dialog [(visible)]="coordinateDialog" header="اضافة الأحداثي الجغرافي" [modal]="true" [draggable]="false" [resizable]="false" [style]="{ width: '34rem' }">
                <div class="flex flex-col gap-4" dir="rtl">
                    <div>
                        <label class="block font-medium mb-2">اسم الأحداثي الجغرافي</label>
                        <p-inputMask
                            mask="99a aa 99999 99999"
                            [(ngModel)]="coordinateDraftName"
                            [unmask]="false"
                            placeholder="12A AA 12345 12345"
                            styleClass="w-full"
                        />
                        <small class="text-red-500" *ngIf="coordinateSubmitted && !coordinateDraftName.trim()">يجب ملئ الحقل</small>
                    </div>

                    <div>
                        <label class="block font-medium mb-2">نوع الأحداثي</label>
                        <p-select
                            [(ngModel)]="coordinateDraftType"
                            [options]="coordinateTypes"
                            optionLabel="typeName"
                            placeholder="يرجى الأختيار"
                            class="w-full"
                        />
                        <small class="text-red-500" *ngIf="coordinateSubmitted && !coordinateDraftType">يرجى الأختيار</small>
                    </div>

                    <p-divider />

                    <div class="flex justify-end gap-2">
                        <p-button label="حفظ" icon="pi pi-check" (onClick)="saveCoordinate()" />
                        <p-button label="الغاء" icon="pi pi-times" severity="secondary" [text]="true" (onClick)="coordinateDialog = false" />
                    </div>
                </div>
            </p-dialog>
        </div>
    `
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
