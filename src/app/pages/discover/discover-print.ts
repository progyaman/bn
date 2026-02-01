import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DISCOVER_REPORT_CONFIGS, DiscoverReportConfig } from './discover.data';

@Component({
    selector: 'app-discover-print',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    template: `
        <div dir="rtl" class="card">
            <div class="flex items-center justify-between gap-2 mb-4 print:hidden">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ title }}</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">طباعة التقرير</div>
                </div>
                <div class="flex gap-2">
                    <a class="p-button p-component p-button-secondary" [routerLink]="['/discover', key]">
                        <span class="p-button-icon pi pi-arrow-right"></span>
                        <span class="p-button-label">رجوع</span>
                    </a>
                    <p-button type="button" label="طباعة" icon="pi pi-print" (onClick)="onPrint()" />
                </div>
            </div>

            <div class="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 print:border-0 print:p-0">
                <div class="text-center border-b border-black pb-4 mb-4 grid grid-cols-3 items-center">
                    <div class="text-lg font-bold">
                        وزارة الداخلية<br />مديرية مكافحة الارهاب<br />قسم العمليات<br />شعبة التحليل
                    </div>
                    <div class="flex justify-center">
                        <img src="/images/int-logo.svg" alt="logo" class="h-24" />
                    </div>
                    <div class="text-lg font-bold">
                        نظام البيان الالكتروني<br />العدد: 1<br />التاريخ: {{ localDate }}<br />المنشئ: —
                    </div>
                </div>

                <div class="text-center text-xl font-bold mb-3">
                    ع/ {{ title }}<br />
                    من تاريخ {{ localDate }} الى {{ localDate }}
                </div>

                <table class="w-full border-collapse text-center text-lg font-bold" border="2">
                    <thead>
                        <tr class="bg-surface-100">
                            <th *ngFor="let col of headerColumns">{{ col }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-row">
                            <td *ngFor="let col of headerColumns">-</td>
                        </tr>
                        <tr class="table-row" *ngIf="config?.printLayout === 'matrix'">
                            <td class="first-col">المجموع</td>
                            <td *ngFor="let col of extraMatrixColumns">-</td>
                        </tr>
                    </tbody>
                </table>

                <div class="grid grid-cols-3 items-center border-t border-black pt-3 mt-6 text-sm font-bold">
                    <div class="text-right">قسم البيانات / الإحصاء</div>
                    <div class="flex justify-center">
                        <img src="/images/karbala-logo.svg" alt="logo" class="h-12" />
                    </div>
                    <div class="text-left">تاريخ الإخراج / {{ localDateTime }}</div>
                    <div class="text-right col-span-3 mt-2">اسم المستخدم: —</div>
                </div>
            </div>
        </div>
    `
})
export class DiscoverPrintPage {
    key = '';
    title = 'الكشوفات';
    config: DiscoverReportConfig | null = null;
    headerColumns: string[] = [];
    extraMatrixColumns: string[] = [];
    localDate = '';
    localDateTime = '';

    constructor(route: ActivatedRoute) {
        this.key = route.snapshot.paramMap.get('key') ?? '';
        this.config = DISCOVER_REPORT_CONFIGS.find((r) => r.key === this.key) ?? null;
        this.title = this.config?.title ?? 'الكشوفات';
        this.headerColumns = [...(this.config?.columns ?? [])];
        if (this.config?.printLayout === 'matrix') {
            this.headerColumns = [this.headerColumns[0] ?? 'البند', ...this.headerColumns.slice(1), 'المجموع'];
            this.extraMatrixColumns = this.headerColumns.slice(1);
        }
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.localDate = `${date.getFullYear()}/${month}/${day}`;
        const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        this.localDateTime = `${time} - ${this.localDate}`;
    }

    onPrint(): void {
        window.print();
    }
}
