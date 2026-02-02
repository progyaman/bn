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
    templateUrl: './import_export.html',
    styleUrl: './import_export.scss'
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
