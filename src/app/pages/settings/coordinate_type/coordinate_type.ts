import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface CoordinateType {
    id: number;
    typeName: string;
    typeIcon: string; // PrimeIcon class name
    createDate: Date;
}

interface IconOption {
    icon: string;
    label: string;
}

@Component({
    selector: 'app-settings-coordinate-type',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        ConfirmDialogModule,
        ToastModule,
        DividerModule,
        DataViewModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card" dir="rtl">
            <p-toast />
            <p-confirmdialog />

            <div class="flex flex-col gap-2 mb-6">
                <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">انواع الاحداثيات الجغرافية</div>
                <div class="text-surface-600 dark:text-surface-300 text-sm">إدارة أنواع الاحداثيات (إضافة / تعديل / حذف).</div>
            </div>

            <p-divider />

            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <p-button label="اضافة نوع احداثي" icon="pi pi-plus" severity="secondary" (onClick)="openNew()" />
                </ng-template>
                <ng-template #end>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="البحث ..." />
                    </p-iconfield>
                </ng-template>
            </p-toolbar>

            <p-table
                #dt
                [value]="items()"
                [rows]="10"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                [globalFilterFields]="['typeName', 'typeIcon']"
                [tableStyle]="{ 'min-width': '60rem' }"
                currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords}"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 20, 30]"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 12rem">تعـديــل / حــــذف</th>
                        <th style="width: 5rem">التسلسل</th>
                        <th>نوع الاحداثي الجغرافي</th>
                        <th style="width: 10rem">الايقونة</th>
                        <th style="width: 12rem">تاريخ الأضافة</th>
                    </tr>
                </ng-template>

                <ng-template #body let-row let-rowIndex="rowIndex">
                    <tr>
                        <td>
                            <div class="flex gap-2 justify-end">
                                <p-button icon="pi pi-pencil" severity="secondary" [text]="true" (onClick)="editRow(row)" />
                                <p-button icon="pi pi-trash" severity="danger" [text]="true" (onClick)="confirmDelete(row)" />
                            </div>
                        </td>
                        <td>{{ rowIndex + 1 }}</td>
                        <td class="font-medium text-surface-900 dark:text-surface-0">{{ row.typeName }}</td>
                        <td class="text-surface-700 dark:text-surface-200"><i [class]="row.typeIcon" aria-hidden="true"></i></td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.createDate | date: 'yyyy-MM-dd' }}</td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5" class="text-center text-surface-600 dark:text-surface-300">لا يوجد نوع احداثي جغرافي.</td>
                    </tr>
                </ng-template>
            </p-table>

            <p-dialog
                [(visible)]="itemDialog"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: '48rem' }"
                header="نافذة اضافة نوع احداثية"
            >
                <div class="flex flex-col gap-4" dir="rtl">
                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">اسم نوع الاحداثية</label>
                        <input pInputText type="text" class="w-full" [(ngModel)]="selected.typeName" maxlength="255" />
                        <small class="text-red-500" *ngIf="submitted && !selected.typeName.trim()">يجب ملئ الحقل</small>
                    </div>

                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">الايقونة</label>
                        <div class="border border-surface-200 dark:border-surface-700 rounded-lg p-3">
                            <p-dataView
                                [value]="iconOptions"
                                layout="grid"
                                [paginator]="false"
                                [rows]="999"
                                [style]="{ height: '320px', overflow: 'auto' }"
                            >
                                <ng-template #grid let-icon>
                                    <div class="col-span-12 md:col-span-6 xl:col-span-4 p-2">
                                        <button
                                            type="button"
                                            class="w-full border border-surface-200 dark:border-surface-700 rounded-lg p-3 flex items-center gap-3 hover:bg-emphasis transition-colors"
                                            [class.bg-emphasis]="selected.typeIcon === icon.icon"
                                            (click)="selectIcon(icon.icon)"
                                        >
                                            <i [class]="icon.icon" aria-hidden="true"></i>
                                            <span class="text-surface-900 dark:text-surface-0">{{ icon.label }}</span>
                                        </button>
                                    </div>
                                </ng-template>
                            </p-dataView>
                        </div>
                        <small class="text-red-500" *ngIf="submitted && !selected.typeIcon">يرجى اختيار الايقونة</small>
                    </div>

                    <p-divider />

                    <div class="flex justify-end gap-2">
                        <p-button label="الغاء" severity="secondary" [outlined]="true" (onClick)="hideDialog()" />
                        <p-button label="حفظ" icon="pi pi-check" (onClick)="save()" />
                    </div>
                </div>
            </p-dialog>
        </div>
    `
})
export class SettingsCoordinateType {
    @ViewChild('dt') dt?: Table;

    iconOptions: IconOption[] = [
        { icon: 'pi pi-map-marker', label: 'Map Marker' },
        { icon: 'pi pi-compass', label: 'Compass' },
        { icon: 'pi pi-directions', label: 'Directions' },
        { icon: 'pi pi-flag', label: 'Flag' },
        { icon: 'pi pi-location-arrow', label: 'Location Arrow' },
        { icon: 'pi pi-globe', label: 'Globe' },
        { icon: 'pi pi-crosshairs', label: 'Crosshairs' },
        { icon: 'pi pi-map', label: 'Map' }
    ];

    items = signal<CoordinateType[]>([
        { id: 1, typeName: 'نوع 1', typeIcon: 'pi pi-map-marker', createDate: new Date() },
        { id: 2, typeName: 'نوع 2', typeIcon: 'pi pi-compass', createDate: new Date() }
    ]);

    itemDialog = false;
    submitted = false;

    selected: CoordinateType = { id: 0, typeName: '', typeIcon: '', createDate: new Date() };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, typeName: '', typeIcon: '', createDate: new Date() };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: CoordinateType): void {
        this.selected = { id: row.id, typeName: row.typeName, typeIcon: row.typeIcon, createDate: row.createDate };
        this.submitted = false;
        this.itemDialog = true;
    }

    selectIcon(icon: string): void {
        this.selected.typeIcon = icon;
    }

    hideDialog(): void {
        this.itemDialog = false;
        this.submitted = false;
    }

    save(): void {
        this.submitted = true;

        const typeName = (this.selected.typeName || '').trim();
        if (!typeName || !this.selected.typeIcon) {
            return;
        }

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) => (it.id === this.selected.id ? { ...it, typeName, typeIcon: this.selected.typeIcon } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث نوع الاحداثي.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, typeName, typeIcon: this.selected.typeIcon, createDate: new Date() }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة نوع احداثي.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: CoordinateType): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف نوع الاحداثي.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: CoordinateType[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
