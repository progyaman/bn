import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';

type SelectOption = { label: string; value: string };

@Component({
    selector: 'arrested-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, SelectModule, DatePickerModule, ChartModule],
    template: `
        <div class="flex flex-col gap-6" dir="rtl">
            <div class="flex items-center justify-between">
                <div class="font-semibold text-xl">إحصائيات المعتقلين</div>
                <p-button icon="pi pi-filter" severity="secondary" (onClick)="isFilterOpen.set(true)" />
            </div>

            <p-dialog header="نافذة البحث المتقدم" [visible]="isFilterOpen()" (visibleChange)="isFilterOpen.set($event)" [modal]="true" [style]="{ width: '32rem' }">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">المهمة</label>
                        <p-select [(ngModel)]="filters.mission" [options]="missionOptions" optionLabel="label" optionValue="value" placeholder="يرجى الأختيار" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">تحديد بين تاريخين</label>
                        <p-datepicker [(ngModel)]="filters.dateRange" selectionMode="range" [showButtonBar]="true" class="w-full" />
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex justify-end gap-2">
                        <p-button label="بحث" icon="pi pi-check" (onClick)="applyFilters()" />
                        <p-button label="الغاء" icon="pi pi-times" severity="secondary" (onClick)="isFilterOpen.set(false)" />
                    </div>
                </ng-template>
            </p-dialog>

            <div class="grid grid-cols-1 gap-6">
                <div class="card">
                    <div class="font-semibold mb-4">التاركت حسب الملفات</div>
                    <div class="h-64">
                        <p-chart type="bar" [data]="stackedByFilesData()" [options]="stackedOptions"></p-chart>
                    </div>
                </div>

                <div class="card">
                    <div class="font-semibold mb-4">الأهداف حسب التنظيم</div>
                    <div class="h-64">
                        <p-chart type="bar" [data]="stackedByOrgData()" [options]="stackedOptions"></p-chart>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ArrestedDashboard {
    isFilterOpen = signal(false);

    missionOptions: SelectOption[] = [
        { label: 'يرجى الأختيار', value: '' },
        { label: 'مهمة 1', value: 'm1' },
        { label: 'مهمة 2', value: 'm2' },
        { label: 'مهمة 3', value: 'm3' }
    ];

    filters = {
        mission: '',
        dateRange: null as any
    };

    private readonly files = ['ملف 1', 'ملف 2', 'ملف 3', 'ملف 4'];
    private readonly orgs = ['تنظيم A', 'تنظيم B', 'تنظيم C', 'تنظيم D'];

    stackedOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
    };

    private seriesFromSeed(seed: number, length: number) {
        const out: number[] = [];
        let x = seed;
        for (let i = 0; i < length; i++) {
            x = (x * 9301 + 49297) % 233280;
            out.push(5 + (x % 18));
        }
        return out;
    }

    stackedByFilesData = computed(() => {
        const missionBoost = this.filters.mission ? 3 : 0;
        return {
            labels: this.files,
            datasets: [
                { label: 'مكتمل', data: this.seriesFromSeed(11, this.files.length).map((v) => v + missionBoost) },
                { label: 'غير مكتمل', data: this.seriesFromSeed(21, this.files.length).map((v) => v + (missionBoost ? 1 : 0)) }
            ]
        };
    });

    stackedByOrgData = computed(() => {
        const missionBoost = this.filters.mission ? 2 : 0;
        return {
            labels: this.orgs,
            datasets: [
                { label: 'مكتمل', data: this.seriesFromSeed(31, this.orgs.length).map((v) => v + missionBoost) },
                { label: 'غير مكتمل', data: this.seriesFromSeed(41, this.orgs.length).map((v) => v + (missionBoost ? 2 : 0)) }
            ]
        };
    });

    applyFilters() {
        this.isFilterOpen.set(false);
    }
}
