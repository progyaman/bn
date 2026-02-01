import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';

type SelectOption = { label: string; value: string };

@Component({
    selector: 'general-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, SelectModule, DatePickerModule, InputTextModule, ChartModule],
    template: `
        <div class="flex flex-col gap-6" dir="rtl">
            <div class="flex items-center justify-between">
                <div class="font-semibold text-xl">الإحصائيات العامة</div>
                <p-button icon="pi pi-filter" severity="secondary" (onClick)="isFilterOpen.set(true)" />
            </div>

            <p-dialog header="نافذة البحث المتقدم" [visible]="isFilterOpen()" (visibleChange)="isFilterOpen.set($event)" [modal]="true" [style]="{ width: '56rem' }">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">المهمة</label>
                        <p-select [(ngModel)]="filters.mission" [options]="missionOptions" optionLabel="label" optionValue="value" placeholder="يرجى الأختيار" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">تحديد بين تاريخين</label>
                        <p-datepicker [(ngModel)]="filters.dateRange" selectionMode="range" [showButtonBar]="true" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">التنظيم</label>
                        <p-select [(ngModel)]="filters.org" [options]="orgOptions" optionLabel="label" optionValue="value" placeholder="يرجى الأختيار" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">بحث نصي</label>
                        <input pInputText [(ngModel)]="filters.query" placeholder="بحث..." />
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex justify-end gap-2">
                        <p-button label="بحث" icon="pi pi-check" (onClick)="applyFilters()" />
                        <p-button label="الغاء" icon="pi pi-times" severity="secondary" (onClick)="isFilterOpen.set(false)" />
                    </div>
                </ng-template>
            </p-dialog>

            <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div class="xl:col-span-9 flex flex-col gap-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                        <div class="card flex flex-col gap-1">
                            <div class="text-surface-500">عدد التنظيمات</div>
                            <div class="text-2xl font-semibold">{{ stats().orgs }}</div>
                        </div>
                        <div class="card flex flex-col gap-1">
                            <div class="text-surface-500">عدد الأهداف</div>
                            <div class="text-2xl font-semibold">{{ stats().targets }}</div>
                        </div>
                        <div class="card flex flex-col gap-1">
                            <div class="text-surface-500">عدد الأحداث</div>
                            <div class="text-2xl font-semibold">{{ stats().events }}</div>
                        </div>
                        <div class="card flex flex-col gap-1">
                            <div class="text-surface-500">عدد الرصد</div>
                            <div class="text-2xl font-semibold">{{ stats().observations }}</div>
                        </div>
                        <div class="card flex flex-col gap-1">
                            <div class="text-surface-500">الخسائر</div>
                            <div class="text-2xl font-semibold">{{ stats().losses }}</div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="font-semibold mb-4">إحصائية شهرية</div>
                        <div class="h-80">
                            <p-chart type="line" [data]="lineData()" [options]="lineOptions"></p-chart>
                        </div>
                    </div>
                </div>

                <div class="xl:col-span-3 flex flex-col gap-6">
                    <div class="card">
                        <div class="font-semibold mb-4">ملخص التنفيذ</div>
                        <div class="h-64">
                            <p-chart type="doughnut" [data]="doughnutData" [options]="doughnutOptions"></p-chart>
                        </div>
                    </div>

                    <div class="card">
                        <div class="font-semibold mb-4">توزيع الحالات</div>
                        <div class="h-64">
                            <p-chart type="pie" [data]="pieData" [options]="pieOptions"></p-chart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class GeneralDashboard {
    isFilterOpen = signal(false);

    missionOptions: SelectOption[] = [
        { label: 'يرجى الأختيار', value: '' },
        { label: 'مهمة 1', value: 'm1' },
        { label: 'مهمة 2', value: 'm2' },
        { label: 'مهمة 3', value: 'm3' }
    ];

    orgOptions: SelectOption[] = [
        { label: 'يرجى الأختيار', value: '' },
        { label: 'تنظيم A', value: 'org-a' },
        { label: 'تنظيم B', value: 'org-b' },
        { label: 'تنظيم C', value: 'org-c' }
    ];

    filters = {
        mission: '',
        org: '',
        dateRange: null as any,
        query: ''
    };

    private readonly monthLabels = ['كانون 2', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين 1', 'تشرين 2', 'كانون 1'];

    private readonly baseSeriesA = [12, 14, 18, 16, 22, 25, 28, 24, 20, 19, 23, 26];
    private readonly baseSeriesB = [8, 10, 9, 12, 14, 15, 17, 16, 13, 11, 12, 14];

    stats = computed(() => {
        const bias = this.filters.mission ? 7 : 0;
        return {
            orgs: 46 + bias,
            targets: 312 + bias * 3,
            events: 128 + bias * 2,
            observations: 905 + bias * 5,
            losses: 19 + Math.floor(bias / 2)
        };
    });

    lineData = computed(() => {
        const shift = this.filters.org ? 2 : 0;
        const seriesA = this.baseSeriesA.map((v, i) => v + shift + (i % 3 === 0 ? 1 : 0));
        const seriesB = this.baseSeriesB.map((v, i) => v + (this.filters.mission ? 1 : 0) + (i % 4 === 0 ? 1 : 0));

        return {
            labels: this.monthLabels,
            datasets: [
                {
                    label: 'الحشد والقوات',
                    data: seriesA,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'العدو',
                    data: seriesB,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }
            ]
        };
    });

    lineOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    doughnutData: any = {
        labels: ['منجز', 'غير منجز'],
        datasets: [
            {
                data: [52, 48]
            }
        ]
    };

    doughnutOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { display: false }
        }
    };

    pieData: any = {
        labels: ['مكتمل', 'غير مكتمل', 'مهام إضافية'],
        datasets: [
            {
                data: [24, 62, 14]
            }
        ]
    };

    pieOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom' }
        }
    };

    applyFilters() {
        this.isFilterOpen.set(false);
    }
}
