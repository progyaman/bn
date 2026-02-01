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
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface ActivityType {
    id: number;
    name: string;
}

interface OrgName {
    id: number;
    name: string;
}

interface TypeOrgName {
    id: number;
    name: string;
    activityTypes: ActivityType[];
    orgNames: OrgName[];
}

type TypeOrgNameRow = TypeOrgName & {
    activityTypesString: string;
    orgNamesString: string;
};

@Component({
    selector: 'app-settings-type-org-name',
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
        MultiSelectModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card" dir="rtl">
            <p-toast />
            <p-confirmdialog />

            <div class="flex flex-col gap-2 mb-6">
                <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">نوع التنظيم</div>
                <div class="text-surface-600 dark:text-surface-300 text-sm">إدارة نوع التنظيم (إضافة / تعديل / حذف).</div>
            </div>

            <p-divider />

            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <p-button label="اضافة نوع التنظيم" icon="pi pi-plus" severity="secondary" (onClick)="openNew()" />
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
                [globalFilterFields]="['name', 'activityTypesString', 'orgNamesString']"
                [tableStyle]="{ 'min-width': '78rem' }"
                currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords}"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 20, 30]"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 12rem">تعـديــل / حــــذف</th>
                        <th style="width: 5rem">التسلسل</th>
                        <th>نوع التنظيم</th>
                        <th>نوع الحدث</th>
                        <th>اسم التنظيم</th>
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
                        <td class="text-surface-700 dark:text-surface-200">{{ row.activityTypesString || '-' }}</td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.orgNamesString || '-' }}</td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5" class="text-center text-surface-600 dark:text-surface-300">لا يوجد أنواع تنظيم.</td>
                    </tr>
                </ng-template>
            </p-table>

            <p-dialog
                [(visible)]="itemDialog"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: '68rem' }"
                header="نافذة اضافة نوع التنظيم"
            >
                <div class="flex flex-col gap-4" dir="rtl">
                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">نوع التنظيم</label>
                        <input pInputText type="text" class="w-full" [(ngModel)]="selected.name" maxlength="255" />
                        <small class="text-red-500" *ngIf="submitted && !selected.name.trim()">الاسم مطلوب.</small>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">نوع الحدث</label>
                            <p-multiselect
                                class="w-full"
                                [options]="activityTypes()"
                                optionLabel="name"
                                [filter]="true"
                                filterBy="name"
                                placeholder="يرجى الاختيار"
                                [(ngModel)]="selected.activityTypes"
                            />
                            <small class="text-red-500" *ngIf="submitted && (!selected.activityTypes || !selected.activityTypes.length)">
                                يرجى اختيار نوع الحدث
                            </small>
                        </div>

                        <div>
                            <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">اسم التنظيم</label>
                            <p-multiselect
                                class="w-full"
                                [options]="orgNames()"
                                optionLabel="name"
                                [filter]="true"
                                filterBy="name"
                                placeholder="يرجى الاختيار"
                                [(ngModel)]="selected.orgNames"
                            />
                            <small class="text-red-500" *ngIf="submitted && (!selected.orgNames || !selected.orgNames.length)">
                                يرجى اختيار اسم التنظيم
                            </small>
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
export class SettingsTypeOrgName {
    @ViewChild('dt') dt?: Table;

    activityTypes = signal<ActivityType[]>([
        { id: 1, name: 'نوع نشاط 1' },
        { id: 2, name: 'نوع نشاط 2' },
        { id: 3, name: 'نوع نشاط 3' }
    ]);

    orgNames = signal<OrgName[]>([
        { id: 1, name: 'تنظيم 1' },
        { id: 2, name: 'تنظيم 2' },
        { id: 3, name: 'تنظيم 3' }
    ]);

    items = signal<TypeOrgName[]>([
        {
            id: 1,
            name: 'نوع تنظيم 1',
            activityTypes: [{ id: 1, name: 'نوع نشاط 1' }],
            orgNames: [{ id: 1, name: 'تنظيم 1' }, { id: 2, name: 'تنظيم 2' }]
        },
        {
            id: 2,
            name: 'نوع تنظيم 2',
            activityTypes: [{ id: 2, name: 'نوع نشاط 2' }],
            orgNames: [{ id: 3, name: 'تنظيم 3' }]
        }
    ]);

    rows = computed<TypeOrgNameRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            activityTypesString: (it.activityTypes ?? []).map((x) => x.name).join(' , '),
            orgNamesString: (it.orgNames ?? []).map((x) => x.name).join(' , ')
        }))
    );

    itemDialog = false;
    submitted = false;

    selected: TypeOrgName = {
        id: 0,
        name: '',
        activityTypes: [],
        orgNames: []
    };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', activityTypes: [], orgNames: [] };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: TypeOrgNameRow): void {
        this.selected = {
            id: row.id,
            name: row.name,
            activityTypes: row.activityTypes ?? [],
            orgNames: row.orgNames ?? []
        };
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
        const activityTypes = this.selected.activityTypes ?? [];
        const orgNames = this.selected.orgNames ?? [];

        if (!name || !activityTypes.length || !orgNames.length) {
            return;
        }

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) =>
                    it.id === this.selected.id ? { ...it, name, activityTypes: [...activityTypes], orgNames: [...orgNames] } : it
                )
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث نوع التنظيم.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, activityTypes: [...activityTypes], orgNames: [...orgNames] }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة نوع التنظيم.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: TypeOrgNameRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف نوع التنظيم.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: TypeOrgName[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
