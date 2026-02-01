import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';

export interface File103LocationModel {
    country?: string | null;
    city?: string | null;
    neighbourhood?: string;
    coordinates?: string[];
    theNews?: string;
    note?: string;
}

@Component({
    selector: 'app-file103-location-section',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectModule, InputTextModule, AutoCompleteModule, ButtonModule, TextareaModule],
    template: `
        <div class="card mb-0" dir="rtl">
            <div class="flex items-center gap-2 mb-4">
                <i class="pi pi-map"></i>
                <div class="text-lg font-semibold text-surface-900 dark:text-surface-0">موقع النشاط</div>
            </div>

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-4">
                    <label class="block font-medium mb-2">الدولة</label>
                    <p-select [(ngModel)]="model.country" [options]="countryOptions" placeholder="يرجى الأختيار" class="w-full" (onChange)="onCountryChange()" />
                </div>

                <div class="col-span-12 md:col-span-4">
                    <label class="block font-medium mb-2">المحافظة</label>
                    <p-select [(ngModel)]="model.city" [options]="cityOptions" placeholder="يرجى الأختيار" class="w-full" />
                </div>

                <div class="col-span-12 md:col-span-4">
                    <label class="block font-medium mb-2">المنطقة</label>
                    <input pInputText [(ngModel)]="model.neighbourhood" class="w-full" />
                </div>

                <div class="col-span-12">
                    <label class="block font-medium mb-2">الأحداثي الجغرافي</label>
                    <p-autocomplete
                        [(ngModel)]="model.coordinates"
                        [suggestions]="coordinateSuggestions"
                        (completeMethod)="onCoordinateSearch($event)"
                        placeholder="بحث..."
                        [multiple]="true"
                        [forceSelection]="false"
                        class="w-full"
                    />

                    <div class="flex justify-start mt-2">
                        <p-button type="button" label="إضافة أحداثي" icon="pi pi-plus" (onClick)="addCoordinateClick.emit()" />
                    </div>
                </div>

                <div class="col-span-12">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div class="text-base font-semibold text-surface-900 dark:text-surface-0">المتن (الخبر او المعلومة)</div>
                        <p-button type="button" label="المساعد الذكي" icon="pi pi-plus" severity="secondary" (onClick)="smartAssistClick.emit()" />
                    </div>
                    <textarea pTextarea [(ngModel)]="model.theNews" rows="3" class="w-full mt-2"></textarea>
                </div>

                <div class="col-span-12">
                    <div class="text-base font-semibold text-surface-900 dark:text-surface-0 mb-2">الملاحظات</div>
                    <textarea pTextarea [(ngModel)]="model.note" rows="4" class="w-full"></textarea>
                </div>
            </div>
        </div>
    `
})
export class File103LocationSection {
    @Input({ required: true }) model!: File103LocationModel;

    @Output() addCoordinateClick = new EventEmitter<void>();
    @Output() smartAssistClick = new EventEmitter<void>();

    coordinateSuggestions: string[] = [];

    countryOptions = ['يرجى الأختيار', 'سوريا', 'العراق', 'لبنان'];
    cityOptions = ['يرجى الأختيار'];

    private citiesByCountry: Record<string, string[]> = {
        سوريا: ['يرجى الأختيار', 'دمشق', 'ريف دمشق', 'حلب', 'حمص'],
        العراق: ['يرجى الأختيار', 'بغداد', 'البصرة', 'الموصل'],
        لبنان: ['يرجى الأختيار', 'بيروت', 'طرابلس']
    };

    private allCoordinates: string[] = [
        '12A AA 12345 12345',
        '13B BB 22222 33333',
        '14C CC 11111 99999'
    ];

    onCountryChange() {
        const key = this.model.country ?? '';
        this.cityOptions = this.citiesByCountry[key] ?? ['يرجى الأختيار'];
        if (this.model.city && !this.cityOptions.includes(this.model.city)) {
            this.model.city = this.cityOptions[0] ?? null;
        }
    }

    onCoordinateSearch(event: AutoCompleteCompleteEvent) {
        const query = (event.query ?? '').toLowerCase();
        this.coordinateSuggestions = this.allCoordinates.filter((c) => c.toLowerCase().includes(query)).slice(0, 10);
    }
}
