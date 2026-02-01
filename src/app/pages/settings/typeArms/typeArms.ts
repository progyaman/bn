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

type ArmsGroup = 'ميداني' | 'علني' | 'فني' | 'رسمي' | 'سري' | 'عكسي';

interface TypeArms {
    id: number;
    nameArms: ArmsGroup;
    name: string;
}

type TypeArmsRow = TypeArms & {
    armsGroupName: string;
};

@Component({
    selector: 'app-settings-type-arms',
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
                <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">نوع ارمي</div>
                <div class="text-surface-600 dark:text-surface-300 text-sm">إدارة نوع الأرمي (إضافة / تعديل / حذف).</div>
            </div>

            <p-divider />

            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <p-button label="اضافة نوع ارمي" icon="pi pi-plus" severity="secondary" (onClick)="openNew()" />
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
                [globalFilterFields]="['nameArms', 'name']"
                [tableStyle]="{ 'min-width': '60rem' }"
                currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords}"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 20, 30]"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 12rem">تعـديــل / حــــذف</th>
                        <th style="width: 5rem">التسلسل</th>
                        <th>اسم ذراع الجمع</th>
                        <th>نوع ذراع الجمع</th>
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
                        <td class="text-surface-700 dark:text-surface-200">{{ row.armsGroupName }}</td>
                        <td class="font-medium text-surface-900 dark:text-surface-0">{{ row.name }}</td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="4" class="text-center text-surface-600 dark:text-surface-300">لا يوجد نوع أرمي.</td>
                    </tr>
                </ng-template>
            </p-table>

            <p-dialog
                [(visible)]="itemDialog"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: '52rem' }"
                header="نافذة اضافة نوع ارمي"
            >
                <div class="flex flex-col gap-4" dir="rtl">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">ذراع الجمع</label>
                            <p-select
                                styleClass="w-full"
                                [options]="armsGroups"
                                [filter]="true"
                                [showClear]="true"
                                placeholder="يرجى الاختيار"
                                [(ngModel)]="selected.nameArms"
                                fluid
                            ></p-select>
                            <small class="text-red-500" *ngIf="submitted && !selected.nameArms">يرجى إختيار ذراع الجمع</small>
                        </div>

                        <div>
                            <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">النوع</label>
                            <input pInputText type="text" class="w-full" [(ngModel)]="selected.name" maxlength="255" />
                            <small class="text-red-500" *ngIf="submitted && !selected.name.trim()">يرجى اختيار النوع</small>
                        </div>
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
export class SettingsTypeArms {
    @ViewChild('dt') dt?: Table;

    armsGroups: ArmsGroup[] = ['ميداني', 'علني', 'فني', 'رسمي', 'سري', 'عكسي'];

    items = signal<TypeArms[]>([
        { id: 1, nameArms: 'ميداني', name: 'نوع ميداني 1' },
        { id: 2, nameArms: 'علني', name: 'نوع علني 1' }
    ]);

    rows = computed<TypeArmsRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            armsGroupName: it.nameArms
        }))
    );

    itemDialog = false;
    submitted = false;

    selected: TypeArms = { id: 0, nameArms: null as unknown as ArmsGroup, name: '' };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, nameArms: null as unknown as ArmsGroup, name: '' };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: TypeArmsRow): void {
        this.selected = { id: row.id, nameArms: row.nameArms, name: row.name };
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
        if (!name || !this.selected.nameArms) {
            return;
        }

        const nameArms = this.selected.nameArms;

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) => (it.id === this.selected.id ? { ...it, name, nameArms } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث نوع الأرمي.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, nameArms }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة نوع الأرمي.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: TypeArmsRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف نوع الأرمي.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: TypeArms[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
