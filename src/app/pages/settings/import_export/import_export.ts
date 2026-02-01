import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-settings-import-export',
    standalone: true,
    imports: [CommonModule, ButtonModule, FileUploadModule, ToastModule, DividerModule],
    providers: [MessageService],
    template: `
        <div class="card" dir="rtl">
            <p-toast />

            <div class="flex flex-col gap-2 mb-6">
                <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">الاستيراد / التصدير</div>
                <div class="text-surface-600 dark:text-surface-300 text-sm">تصدير الاعدادات واستيرادها (واجهة فقط حالياً).</div>
            </div>

            <p-divider />

            <div class="flex flex-col gap-4">
                <div>
                    <p-button
                        icon="pi pi-external-link"
                        label="تصدير الاعدادات"
                        severity="secondary"
                        (onClick)="exportSettings()"
                    />
                </div>

                <div>
                    <p-fileupload
                        [multiple]="true"
                        [customUpload]="true"
                        chooseLabel="استيراد"
                        uploadLabel="رفع"
                        cancelLabel="الغاء الرفع"
                        chooseIcon="pi pi-download"
                        uploadIcon="pi pi-download"
                        [showUploadButton]="true"
                        [showCancelButton]="true"
                        [maxFileSize]="10000000"
                        (uploadHandler)="onImport($event)"
                    ></p-fileupload>
                    <div class="text-surface-600 dark:text-surface-300 text-sm mt-2">
                        لرفع اكثر من ملف: اضغط Ctrl + تحديد الملفات.
                    </div>
                </div>
            </div>
        </div>
    `
})
export class SettingsImportExport {
    constructor(private readonly messageService: MessageService) {}

    exportSettings(): void {
        this.messageService.add({
            severity: 'success',
            summary: 'تم',
            detail: 'تم طلب تصدير الإعدادات (واجهة فقط حالياً).'
        });
    }

    onImport(event: any): void {
        const files = event?.files ?? [];
        const count = Array.isArray(files) ? files.length : 0;

        this.messageService.add({
            severity: 'success',
            summary: 'تم',
            detail: count ? `تم استلام ${count} ملف/ملفات للاستيراد (واجهة فقط).` : 'تم استلام ملفات للاستيراد (واجهة فقط).'
        });
    }
}
