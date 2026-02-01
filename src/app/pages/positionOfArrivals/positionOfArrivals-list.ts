import { CommonModule } from '@angular/common';
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

interface PositionOfArrivalsRow {
    id: number;
    date: Date | null;
    numberOfArrivals: number | null;
    numberOfDepartures: number | null;
    nationality: string;
    borderCrossingPoint: string;
}

@Component({
    selector: 'app-position-of-arrivals-list',
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
    providers: [MessageService, ConfirmationService],
    template: `
        <div dir="rtl">
            <p-toast />
            <p-confirmdialog [style]="{ width: '420px' }" />

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">موقف الوافدين</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">موقف أعداد الزائرين</div>
                </div>
                <div class="flex gap-2">
                    <a class="p-button p-component" routerLink="/positionOfArrivals/create">
                        <span class="p-button-icon pi pi-plus"></span>
                        <span class="p-button-label">إضافة موقف جديد</span>
                    </a>
                </div>
            </div>

            <div class="card mb-0">
                <div class="grid grid-cols-12 gap-3 mb-3">
                    <div class="col-span-12 md:col-span-4">
                        <span class="p-input-icon-left w-full">
                            <i class="pi pi-search"></i>
                            <input pInputText [(ngModel)]="q" placeholder="البحث ..." class="w-full" />
                        </span>
                    </div>
                    <div class="col-span-12 md:col-span-3">
                        <p-select [(ngModel)]="selectedNationality" [options]="nationalities" placeholder="الجنسية (الكل)" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-3">
                        <p-select [(ngModel)]="selectedBorderCrossingPoint" [options]="borderCrossingPoints" placeholder="المنفذ (الكل)" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-2">
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
                            <th class="w-36">تعديل / حذف</th>
                            <th class="w-56">التاريخ</th>
                            <th class="w-40">عدد الوافدين</th>
                            <th class="w-40">عدد المغادرين</th>
                            <th class="w-40">الجنسية</th>
                            <th class="w-64">المنفذ الحدودي/المطار</th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-row let-i="rowIndex">
                        <tr>
                            <td>{{ i + 1 }}</td>
                            <td>
                                <div class="flex gap-2 justify-center">
                                    <a
                                        class="p-button p-component p-button-rounded p-button-text"
                                        [routerLink]="'/positionOfArrivals/create'"
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
                                </div>
                            </td>
                            <td>{{ row.date ? (row.date | date : 'yyyy-MM-dd') : '-' }}</td>
                            <td>{{ row.numberOfArrivals ?? '-' }}</td>
                            <td>{{ row.numberOfDepartures ?? '-' }}</td>
                            <td>{{ row.nationality }}</td>
                            <td>{{ row.borderCrossingPoint }}</td>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7" class="text-center">لا توجد بيانات</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `
})
export class PositionOfArrivalsListPage {
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    q = '';
    selectedNationality: string | null = null;
    selectedBorderCrossingPoint: string | null = null;
    dateRange: Date[] | null = null;

    nationalities = ['عراقي', 'ايراني', 'جنسيات اخرى'];
    borderCrossingPoints = ['مطار بغداد', 'مطار النجف', 'منفذ الشلامجة', 'منفذ زرباطية', 'منفذ عرعر', 'أخرى'];

    rows = signal<PositionOfArrivalsRow[]>([
        {
            id: 1,
            date: new Date(),
            numberOfArrivals: 250,
            numberOfDepartures: 120,
            nationality: 'عراقي',
            borderCrossingPoint: 'مطار بغداد'
        }
    ]);

    filtered = computed(() => {
        const query = this.q.trim().toLowerCase();
        const nat = (this.selectedNationality ?? '').trim();
        const border = (this.selectedBorderCrossingPoint ?? '').trim();
        const [start, end] = this.dateRange && this.dateRange.length === 2 ? this.dateRange : [null, null];

        return this.rows().filter((r) => {
            if (nat && r.nationality !== nat) return false;
            if (border && r.borderCrossingPoint !== border) return false;

            if (query) {
                const hay = `${r.id} ${r.nationality} ${r.borderCrossingPoint} ${r.numberOfArrivals ?? ''} ${r.numberOfDepartures ?? ''}`.toLowerCase();
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

    confirmDelete(row: PositionOfArrivalsRow): void {
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
