import { CommonModule } from '@angular/common';
import { Component, computed, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface Country {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    country: Country;
}

interface District {
    id: number;
    name: string;
    city: City;
}

interface HandDistrict {
    id: number;
    name: string;
    district: District;
}

type HandDistrictRow = HandDistrict & {
    districtName: string;
    cityName: string;
};

@Component({
    selector: 'app-settings-handdistrict',
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
        SelectModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card" dir="rtl">
            <p-toast />
            <p-confirmdialog />

            <div class="flex flex-col gap-2 mb-6">
                <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">الناحية</div>
                <div class="text-surface-600 dark:text-surface-300 text-sm">إدارة النواحي (إضافة / تعديل / حذف).</div>
            </div>

            <p-divider />

            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <p-button label="اضافة ناحية" icon="pi pi-plus" severity="secondary" (onClick)="openNew()" />
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
                [value]="rows()"
                [rows]="10"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                [globalFilterFields]="['name', 'districtName', 'cityName']"
                [tableStyle]="{ 'min-width': '72rem' }"
                currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords}"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 20, 30]"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 12rem">تعـديــل / حــــذف</th>
                        <th style="width: 5rem">التسلسل</th>
                        <th>الناحية</th>
                        <th>القضاء</th>
                        <th>المحافظة</th>
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
                        <td class="font-medium text-surface-900 dark:text-surface-0">{{ row.name }}</td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.districtName || '-' }}</td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.cityName || '-' }}</td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5" class="text-center text-surface-600 dark:text-surface-300">لا يوجد نواحي.</td>
                    </tr>
                </ng-template>
            </p-table>

            <p-dialog
                [(visible)]="itemDialog"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: '48rem' }"
                header="نافذة اضافة الناحية"
            >
                <div class="flex flex-col gap-4" dir="rtl">
                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">اسم الناحية</label>
                        <input pInputText type="text" class="w-full" [(ngModel)]="selected.name" maxlength="255" />
                        <small class="text-red-500" *ngIf="submitted && !selected.name.trim()">الاسم مطلوب.</small>
                    </div>

                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">اسم القضاء</label>
                        <p-select
                            styleClass="w-full"
                            [options]="districts()"
                            optionLabel="name"
                            [filter]="true"
                            filterBy="name"
                            [showClear]="true"
                            placeholder="يرجى الاختيار"
                            [(ngModel)]="selected.district"
                            fluid
                        ></p-select>
                        <small class="text-red-500" *ngIf="submitted && !selected.district">القضاء مطلوب.</small>
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
export class SettingsHandDistrict {
    @ViewChild('dt') dt?: Table;

    private readonly iraq: Country = { id: 1, name: 'العراق' };
    private readonly baghdad: City = { id: 1, name: 'بغداد', country: this.iraq };

    districts = signal<District[]>([
        { id: 1, name: 'الكرخ', city: this.baghdad },
        { id: 2, name: 'الرصافة', city: this.baghdad }
    ]);

    items = signal<HandDistrict[]>([
        { id: 1, name: 'ناحية 1', district: { id: 1, name: 'الكرخ', city: this.baghdad } },
        { id: 2, name: 'ناحية 2', district: { id: 2, name: 'الرصافة', city: this.baghdad } }
    ]);

    rows = computed<HandDistrictRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            districtName: it.district?.name ?? '',
            cityName: it.district?.city?.name ?? ''
        }))
    );

    itemDialog = false;
    submitted = false;

    selected: HandDistrict = { id: 0, name: '', district: null as unknown as District };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', district: null as unknown as District };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: HandDistrictRow): void {
        this.selected = { id: row.id, name: row.name, district: row.district };
        this.submitted = false;
        this.itemDialog = true;
    }

    hideDialog(): void {
        this.itemDialog = false;
        this.submitted = false;
    }

    save(): void {
        this.submitted = true;

        const name = (this.selected.name || '').trim();
        if (!name || !this.selected.district) {
            return;
        }

        const district = this.selected.district;

        if (this.selected.id) {
            this.items.update((list) => list.map((it) => (it.id === this.selected.id ? { ...it, name, district } : it)));
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث الناحية.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, district }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الناحية.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: HandDistrictRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الناحية.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: HandDistrict[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
