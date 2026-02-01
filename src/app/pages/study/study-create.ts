import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

interface StudyTypeOption {
    id: number;
    name: string;
}

interface StudyAttachment {
    id: string;
    name: string;
    size?: number;
}

interface StudyModel {
    name: string;
    studyType: StudyTypeOption | null;
    placeIssue: string;
    date: Date | null;
    uploadFiles: StudyAttachment[];
}

@Component({
    selector: 'app-study-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ToastModule,
        ButtonModule,
        DividerModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        FileUploadModule,
        TableModule
    ],
    providers: [MessageService],
    template: `
        <div dir="rtl">
            <p-toast />

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">الدراسة</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">{{ editId ? 'تعديل دراسة' : 'إضافة دراسة' }}</div>
                </div>
                <div class="flex gap-2">
                    <a class="p-button p-component p-button-secondary" routerLink="/study/list">
                        <span class="p-button-icon pi pi-list"></span>
                        <span class="p-button-label">قائمة الدراسات</span>
                    </a>
                    <p-button type="button" label="حفظ" icon="pi pi-save" (onClick)="save()" />
                </div>
            </div>

            <div class="card mb-0 ui-fluid">
                <div class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">بيانات الدراسة</div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-8">
                        <label class="block font-medium mb-2">اسم الدراسة</label>
                        <input pInputText [(ngModel)]="model.name" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <label class="block font-medium mb-2">نوع الدراسة</label>
                        <p-select [(ngModel)]="model.studyType" [options]="studyTypes" optionLabel="name" placeholder="يرجى الأختيار" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-8">
                        <label class="block font-medium mb-2">مكان الأصدار</label>
                        <input pInputText [(ngModel)]="model.placeIssue" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <label class="block font-medium mb-2">التاريخ</label>
                        <p-datepicker appendTo="body" [(ngModel)]="model.date" [showButtonBar]="true" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                </div>

                <p-divider />

                <div class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-3">المرفقات</div>

                <p-fileupload
                    mode="basic"
                    name="studyFiles"
                    chooseLabel="رفع مرفق"
                    [multiple]="true"
                    [maxFileSize]="104857640"
                    (onSelect)="onFilesSelect($event)"
                    styleClass="p-button-outlined"
                ></p-fileupload>
                <div class="text-xs text-surface-600 dark:text-surface-300 mt-2">واجهة تجريبية بدون رفع حقيقي</div>

                <div class="mt-3">
                    <p-table [value]="model.uploadFiles" [paginator]="true" [rows]="10" responsiveLayout="scroll" showGridlines="true" stripedRows="true">
                        <ng-template pTemplate="header">
                            <tr>
                                <th class="w-24">حذف</th>
                                <th>اسم الملف</th>
                                <th class="w-48">الحجم</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-row>
                            <tr>
                                <td>
                                    <button
                                        type="button"
                                        class="p-button p-component p-button-rounded p-button-text p-button-danger"
                                        (click)="removeAttachment(row.id)"
                                    >
                                        <span class="p-button-icon pi pi-trash"></span>
                                    </button>
                                </td>
                                <td>{{ row.name }}</td>
                                <td>{{ row.size ? ((row.size / 1024) | number) : '-' }} KB</td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="3" class="text-center">لا توجد مرفقات</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>

                <p-divider />

                <div class="flex justify-end">
                    <p-button type="button" label="حفظ" icon="pi pi-save" (onClick)="save()" />
                </div>
            </div>
        </div>
    `
})
export class StudyCreatePage {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    editId: number | null = null;

    studyTypes: StudyTypeOption[] = [
        { id: 1, name: 'تحقيقية' },
        { id: 2, name: 'ميدانية' },
        { id: 3, name: 'أخرى' }
    ];

    model: StudyModel = {
        name: '',
        studyType: null,
        placeIssue: '',
        date: null,
        uploadFiles: []
    };

    constructor() {
        const idParam = this.route.snapshot.queryParamMap.get('id');
        const id = idParam ? Number(idParam) : NaN;
        this.editId = Number.isFinite(id) ? id : null;

        if (this.editId) {
            this.model = {
                name: `دراسة رقم ${this.editId}`,
                studyType: this.studyTypes[0],
                placeIssue: '—',
                date: new Date(),
                uploadFiles: []
            };
        }
    }

    private newId(): string {
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    onFilesSelect(event: FileSelectEvent): void {
        const files = event.files ?? [];
        const next = [...this.model.uploadFiles];
        for (const file of files) {
            next.push({
                id: this.newId(),
                name: file.name,
                size: file.size
            });
        }
        this.model.uploadFiles = next;
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة المرفقات (تجريبي)' });
    }

    removeAttachment(id: string): void {
        this.model.uploadFiles = this.model.uploadFiles.filter((x) => x.id !== id);
    }

    save(): void {
        if (!this.model.name.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل اسم الدراسة' });
            return;
        }
        if (!this.model.studyType) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل نوع الدراسة' });
            return;
        }
        if (!this.model.placeIssue.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل مكان الأصدار' });
            return;
        }
        if (!this.model.date) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل التاريخ' });
            return;
        }

        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم الحفظ بنجاح (تجريبي)' });
        void this.router.navigate(['/study/list']);
    }
}
