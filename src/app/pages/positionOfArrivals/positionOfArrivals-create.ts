import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

interface PositionOfArrivalsModel {
    date: Date | null;
    numberOfArrivals: number | null;
    numberOfDepartures: number | null;
    nationality: string | null;
    borderCrossingPoint: string | null;
}

@Component({
    selector: 'app-position-of-arrivals-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ToastModule, ButtonModule, DividerModule, DatePickerModule, InputNumberModule, SelectModule],
    providers: [MessageService],
    template: `
        <div dir="rtl">
            <p-toast />

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">موقف الوافدين</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">{{ editId ? 'تعديل موقف' : 'إضافة موقف' }}</div>
                </div>
                <div class="flex gap-2">
                    <a class="p-button p-component p-button-secondary" routerLink="/positionOfArrivals/list">
                        <span class="p-button-icon pi pi-list"></span>
                        <span class="p-button-label">رجوع</span>
                    </a>
                    <p-button type="button" label="حفظ" icon="pi pi-save" (onClick)="save()" />
                </div>
            </div>

            <div class="card mb-0 ui-fluid">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-3">
                        <label class="block font-medium mb-2">التاريخ</label>
                        <p-datepicker appendTo="body" [(ngModel)]="model.date" [showButtonBar]="true" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <label class="block font-medium mb-2">عدد الوافدين</label>
                        <p-inputNumber [(ngModel)]="model.numberOfArrivals" [min]="0" [useGrouping]="false" class="w-full" />
                        <div class="text-xs text-surface-600 dark:text-surface-300 mt-1">يمكن تركه فارغًا إذا تم إدخال عدد المغادرين.</div>
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <label class="block font-medium mb-2">عدد المغادرين</label>
                        <p-inputNumber [(ngModel)]="model.numberOfDepartures" [min]="0" [useGrouping]="false" class="w-full" />
                        <div class="text-xs text-surface-600 dark:text-surface-300 mt-1">يمكن تركه فارغًا إذا تم إدخال عدد الوافدين.</div>
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <label class="block font-medium mb-2">الجنسية</label>
                        <p-select [(ngModel)]="model.nationality" [options]="nationalities" placeholder="يرجى الأختيار" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-medium mb-2">المنفذ الحدودي/المطار</label>
                        <p-select [(ngModel)]="model.borderCrossingPoint" [options]="borderCrossingPoints" placeholder="يرجى الأختيار" class="w-full" />
                    </div>
                </div>

                <p-divider />

                <div class="flex justify-end gap-2">
                    <p-button type="button" label="حفظ" icon="pi pi-save" (onClick)="save()" />
                    <a class="p-button p-component p-button-secondary" routerLink="/positionOfArrivals/list">
                        <span class="p-button-icon pi pi-arrow-circle-up"></span>
                        <span class="p-button-label">رجوع</span>
                    </a>
                </div>
            </div>
        </div>
    `
})
export class PositionOfArrivalsCreatePage {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    editId: number | null = null;

    nationalities = ['عراقي', 'ايراني', 'جنسيات اخرى'];
    borderCrossingPoints = ['مطار بغداد', 'مطار النجف', 'منفذ الشلامجة', 'منفذ زرباطية', 'منفذ عرعر', 'أخرى'];

    model: PositionOfArrivalsModel = {
        date: null,
        numberOfArrivals: null,
        numberOfDepartures: null,
        nationality: null,
        borderCrossingPoint: null
    };

    constructor() {
        const idParam = this.route.snapshot.queryParamMap.get('id');
        const id = idParam ? Number(idParam) : NaN;
        this.editId = Number.isFinite(id) ? id : null;

        if (this.editId) {
            this.model = {
                date: new Date(),
                numberOfArrivals: 200,
                numberOfDepartures: 100,
                nationality: 'عراقي',
                borderCrossingPoint: 'مطار بغداد'
            };
        }
    }

    save(): void {
        if (!this.model.date) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى تعبئة حقل التاريخ' });
            return;
        }
        if (!this.model.nationality) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى تعبئة حقل الجنسية' });
            return;
        }
        const hasArrivals = this.model.numberOfArrivals !== null && this.model.numberOfArrivals !== undefined;
        const hasDepartures = this.model.numberOfDepartures !== null && this.model.numberOfDepartures !== undefined;
        if (!hasArrivals && !hasDepartures) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى تعبئة عدد الوافدين أو عدد المغادرين' });
            return;
        }

        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم الحفظ بنجاح (تجريبي)' });
        void this.router.navigate(['/positionOfArrivals/list']);
    }
}
