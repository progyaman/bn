import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

export interface File103MediaItem {
    id: string;
    name: string;
    size?: number;
    createdAt?: Date;
}

@Component({
    selector: 'app-file103-media-section',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule],
    template: `
        <div class="card mb-0" dir="rtl">
            <div class="flex items-center gap-2 mb-4">
                <i class="pi pi-paperclip"></i>
                <div class="text-lg font-semibold text-surface-900 dark:text-surface-0">المرفقات</div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div class="text-sm text-surface-600 dark:text-surface-300">يمكنك إضافة/حذف المرفقات (واجهة تجريبية بدون API حاليًا)</div>
                <div class="flex gap-2">
                    <p-button type="button" label="رفع مرفق" icon="pi pi-upload" (onClick)="uploadClick.emit()" />
                </div>
            </div>

            <p-table [value]="items" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,25]" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>اسم الملف</th>
                        <th class="w-48">الحجم</th>
                        <th class="w-40">الإجراءات</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                    <tr>
                        <td>{{ row.name }}</td>
                        <td>{{ row.size ? ((row.size / 1024) | number) : '-' }} KB</td>
                        <td>
                            <div class="flex gap-2">
                                <p-button type="button" icon="pi pi-trash" severity="danger" outlined (onClick)="remove.emit(row.id)" />
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="3" class="text-center">لا يوجد بيانات</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class File103MediaSection {
    @Input({ required: true }) items: File103MediaItem[] = [];

    @Output() uploadClick = new EventEmitter<void>();
    @Output() remove = new EventEmitter<string>();
}
