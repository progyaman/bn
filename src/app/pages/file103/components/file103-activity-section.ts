import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

export interface File103ActivityModel {
    date?: Date | null;
    time?: Date | null;
    durationHours?: number | null;
    organization?: string | null;
    typeOrgNames?: string[];
    tripCode?: string;
    tripNumber?: string;
    airCraftType?: string | null;
    mode3?: string;
    mode2?: string;
    icao?: string;
    locationTakeOff?: string | null;
}

@Component({
    selector: 'app-file103-activity-section',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePickerModule, InputTextModule, InputNumberModule, SelectModule, MultiSelectModule, ButtonModule],
    template: `
        <div class="card mb-0" dir="rtl">
            <div class="flex items-center gap-2 mb-4">
                <i class="pi pi-file"></i>
                <div class="text-lg font-semibold text-surface-900 dark:text-surface-0">معلومات الرصد الجوي</div>
            </div>

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">تاريخ الرصد</label>
                    <p-datepicker appendTo="body" [(ngModel)]="model.date" [showButtonBar]="true" dateFormat="yy-mm-dd" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">وقت الرصد</label>
                    <p-datepicker appendTo="body" [(ngModel)]="model.time" [timeOnly]="true" hourFormat="24" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">مدة الرصد</label>
                    <div class="flex items-center gap-2">
                        <p-inputnumber [(ngModel)]="model.durationHours" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />
                        <span class="text-sm text-surface-600 dark:text-surface-300 whitespace-nowrap">ساعة</span>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">التبعية</label>
                    <p-select [(ngModel)]="model.organization" [options]="organizationOptions" placeholder="يرجى الأختيار" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">نوع نشاط</label>
                    <p-multiselect [(ngModel)]="model.typeOrgNames" [options]="typeOrgNameOptions" defaultLabel="يرجى الأختيار" class="w-full" />
                    <div class="flex justify-start mt-2">
                        <p-button type="button" label="إضافة نوع نشاط" icon="pi pi-plus" severity="secondary" (onClick)="openTypeOrgDialog.emit()" />
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-2">
                    <label class="block font-medium mb-2">رمز الرحلة</label>
                    <input pInputText [(ngModel)]="model.tripCode" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">رقم الرحلة</label>
                    <input pInputText [(ngModel)]="model.tripNumber" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-4">
                    <label class="block font-medium mb-2">نوع الطائرة</label>
                    <p-select [(ngModel)]="model.airCraftType" [options]="airCraftTypeOptions" placeholder="يرجى الأختيار" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">MODE 3</label>
                    <input pInputText [(ngModel)]="model.mode3" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">MODE 2</label>
                    <input pInputText [(ngModel)]="model.mode2" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">ICAO</label>
                    <input pInputText [(ngModel)]="model.icao" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block font-medium mb-2">موقع الإقلاع</label>
                    <p-select [(ngModel)]="model.locationTakeOff" [options]="takeoffOptions" placeholder="يرجى الأختيار" class="w-full" />
                </div>
            </div>
        </div>
    `
})
export class File103ActivitySection {
    @Input({ required: true }) model!: File103ActivityModel;

    @Output() openTypeOrgDialog = new EventEmitter<void>();

    // TODO: Replace with API-backed data.
    organizationOptions = ['يرجى الأختيار', 'جهة 1', 'جهة 2', 'جهة 3'];
    typeOrgNameOptions = ['مهمة استطلاع', 'مرافقة', 'قصف', 'نقل'];
    airCraftTypeOptions = ['يرجى الأختيار', 'ثابتة الجناح', 'مروحية', 'مسيرة'];
    takeoffOptions = ['يرجى الأختيار', 'قاعدة 1', 'قاعدة 2', 'قاعدة 3'];
}
