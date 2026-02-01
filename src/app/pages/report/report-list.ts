import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

interface ReportRow {
    id: number;
    fromThem: string;
    toThem: string;
    theTopic: string;
    details: string;
    date: Date | null;
    reportType: string;
}

@Component({
    selector: 'app-report-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ToastModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService, DatePipe],
    template: `
        <div dir="rtl">
            <p-toast />
            <p-confirmdialog [style]="{ width: '420px' }" />

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">التقارير</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">قائمة التقارير</div>
                </div>
                <div class="flex gap-2">
                    <a class="p-button p-component" routerLink="/report/create">
                        <span class="p-button-icon pi pi-plus"></span>
                        <span class="p-button-label">إضافة تقرير</span>
                    </a>
                </div>
            </div>

            <div class="card mb-0">
                <div class="grid grid-cols-12 gap-3 mb-3">
                    <div class="col-span-12 md:col-span-5">
                        <span class="p-input-icon-left w-full">
                            <i class="pi pi-search"></i>
                            <input pInputText [(ngModel)]="q" placeholder="البحث ..." class="w-full" />
                        </span>
                    </div>
                    <div class="col-span-12 md:col-span-4">
                        <p-select [(ngModel)]="selectedReportType" [options]="reportTypes" placeholder="نوع التقرير (الكل)" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-3">
                        <p-datepicker [(ngModel)]="dateRange" selectionMode="range" [showButtonBar]="true" class="w-full" />
                    </div>
                </div>

                <p-table
                    [value]="filtered()"
                    [paginator]="true"
                    [rows]="20"
                    [rowsPerPageOptions]="[20, 50, 100]"
                    responsiveLayout="scroll"
                    showGridlines="true"
                    stripedRows="true"
                >
                    <ng-template pTemplate="header">
                        <tr>
                            <th class="w-24">ت</th>
                            <th class="w-44">تعديل / حذف / طباعة</th>
                            <th class="w-28">من</th>
                            <th class="w-28">الى</th>
                            <th class="w-40">رقم الصادر</th>
                            <th class="w-64">الموضوع</th>
                            <th class="w-64">التفاصيل</th>
                            <th class="w-48">التاريخ</th>
                            <th class="w-40">نوع التقرير</th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-row let-i="rowIndex">
                        <tr>
                            <td>{{ i + 1 }}</td>
                            <td>
                                <div class="flex gap-2">
                                    <a
                                        class="p-button p-component p-button-rounded p-button-text"
                                        [routerLink]="'/report/create'"
                                        [queryParams]="{ id: row.id }"
                                        title="تعديل"
                                    >
                                        <span class="p-button-icon pi pi-pencil"></span>
                                    </a>
                                    <button
                                        type="button"
                                        class="p-button p-component p-button-rounded p-button-text p-button-danger"
                                        (click)="confirmDelete(row)"
                                        title="حذف"
                                    >
                                        <span class="p-button-icon pi pi-trash"></span>
                                    </button>
                                    <a
                                        class="p-button p-component p-button-rounded p-button-text"
                                        [routerLink]="'/report/print'"
                                        [queryParams]="{ id: row.id }"
                                        title="طباعة"
                                    >
                                        <span class="p-button-icon pi pi-print"></span>
                                    </a>
                                </div>
                            </td>
                            <td>{{ row.fromThem }}</td>
                            <td>{{ row.toThem }}</td>
                            <td>{{ row.id }}</td>
                            <td>{{ row.theTopic }}</td>
                            <td>{{ row.details }}</td>
                            <td>{{ row.date ? (row.date | date : 'yyyy-MM-dd') : '-' }}</td>
                            <td>{{ row.reportType }}</td>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="9" class="text-center">لا توجد تقارير</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `
})
export class ReportListPage {
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    q = '';
    selectedReportType: string | null = null;
    dateRange: Date[] | null = null;

    reportTypes = ['است', 'عملياتي', 'ميداني', 'أخرى'];

    rows = signal<ReportRow[]>([
        {
            id: 1001,
            fromThem: 'قسم الاست',
            toThem: 'القيادة',
            theTopic: 'موضوع تجريبي',
            details: 'تفاصيل تجريبية...',
            date: new Date(),
            reportType: 'است'
        }
    ]);

    filtered = computed(() => {
        const query = this.q.trim().toLowerCase();
        const type = (this.selectedReportType ?? '').trim();
        const [start, end] = this.dateRange && this.dateRange.length === 2 ? this.dateRange : [null, null];

        return this.rows().filter((r) => {
            if (type && r.reportType !== type) return false;

            if (query) {
                const hay = `${r.id} ${r.fromThem} ${r.toThem} ${r.theTopic} ${r.details} ${r.reportType}`.toLowerCase();
                if (!hay.includes(query)) return false;
            }

            if (start && end && r.date) {
                const t = r.date.getTime();
                const a = new Date(start).setHours(0, 0, 0, 0);
                const b = new Date(end).setHours(23, 59, 59, 999);
                if (t < a || t > b) return false;
            }

            return true;
        });
    });

    confirmDelete(row: ReportRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.rows.set(this.rows().filter((x) => x.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم الحذف بنجاح' });
            }
        });
    }
}
