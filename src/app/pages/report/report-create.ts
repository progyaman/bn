import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

interface ReportModel {
    fromThem: string;
    toThem: string;
    theTopic: string;
    details: string;
    date: Date | null;
    reportType: string | null;
}

@Component({
    selector: 'app-report-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ToastModule,
        ButtonModule,
        DividerModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule,
        SelectModule
    ],
    providers: [MessageService],
    template: `
        <div dir="rtl">
            <p-toast />

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">التقرير</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">{{ editId ? 'تعديل تقرير' : 'إضافة تقرير' }}</div>
                </div>
                <div class="flex gap-2">
                    <a class="p-button p-component p-button-secondary" routerLink="/report/list">
                        <span class="p-button-icon pi pi-list"></span>
                        <span class="p-button-label">قائمة التقارير</span>
                    </a>
                    <p-button type="button" label="حفظ" icon="pi pi-save" (onClick)="save()" />
                </div>
            </div>

            <div class="card mb-0 ui-fluid">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-medium mb-2">من</label>
                        <input pInputText [(ngModel)]="model.fromThem" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-medium mb-2">الى</label>
                        <input pInputText [(ngModel)]="model.toThem" class="w-full" />
                    </div>

                    <div class="col-span-12">
                        <label class="block font-medium mb-2">الموضوع</label>
                        <textarea pTextarea [(ngModel)]="model.theTopic" rows="2" class="w-full"></textarea>
                    </div>

                    <div class="col-span-12">
                        <label class="block font-medium mb-2">التفاصيل</label>
                        <textarea pTextarea [(ngModel)]="model.details" rows="5" class="w-full"></textarea>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-medium mb-2">تاريخ التقرير</label>
                        <p-datepicker appendTo="body" [(ngModel)]="model.date" [showButtonBar]="true" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="block font-medium mb-2">نوع التقرير</label>
                        <p-select [(ngModel)]="model.reportType" [options]="reportTypes" placeholder="يرجى الأختيار" class="w-full" />
                    </div>
                </div>

                <p-divider />

                <div class="flex justify-end">
                    <p-button type="button" label="حفظ" icon="pi pi-save" (onClick)="save()" />
                </div>
            </div>
        </div>
    `
})
export class ReportCreatePage {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    editId: number | null = null;

    reportTypes = ['است', 'عملياتي', 'ميداني', 'أخرى'];

    model: ReportModel = {
        fromThem: '',
        toThem: '',
        theTopic: '',
        details: '',
        date: null,
        reportType: null
    };

    constructor() {
        const idParam = this.route.snapshot.queryParamMap.get('id');
        const id = idParam ? Number(idParam) : NaN;
        this.editId = Number.isFinite(id) ? id : null;

        if (this.editId) {
            this.model = {
                fromThem: 'قسم الاست',
                toThem: 'القيادة',
                theTopic: `موضوع التقرير رقم ${this.editId}`,
                details: 'تفاصيل تجريبية...',
                date: new Date(),
                reportType: 'است'
            };
        }
    }

    save(): void {
        if (!this.model.fromThem.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ الحقل ( من )' });
            return;
        }
        if (!this.model.toThem.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ الحقل ( الى )' });
            return;
        }
        if (!this.model.theTopic.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل الموضوع' });
            return;
        }
        if (!this.model.details.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل التفاصيل' });
            return;
        }
        if (!this.model.date) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل التاريخ' });
            return;
        }
        if (!this.model.reportType) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل نوع التقرير' });
            return;
        }

        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم الحفظ بنجاح (تجريبي)' });
        void this.router.navigate(['/report/list']);
    }
}
