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
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface SecurityFile {
    id: number;
    name: string;
}

interface OrgName {
    id: number;
    name: string;
    securityFileId: number;
}

interface ManagementUnit {
    id: number;
    path: string;
}

interface Organization {
    id: number;
    securityFile: SecurityFile;
    orgName: OrgName;
    note: string;
    muId: number | null;
    nickName: string;
}

type OrganizationRow = Organization & {
    securityFileName: string;
    orgNameName: string;
    muPath: string;
};

@Component({
    selector: 'app-settings-org',
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
        SelectModule,
        TextareaModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card" dir="rtl">
            <p-toast />
            <p-confirmdialog />

            <div class="flex flex-col gap-2 mb-6">
                <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">اورك</div>
                <div class="text-surface-600 dark:text-surface-300 text-sm">إدارة اورك (إضافة / تعديل / حذف).</div>
            </div>

            <p-divider />

            <p-toolbar styleClass="mb-4">
                <ng-template #start>
                    <p-button label="اضافة اورك" icon="pi pi-plus" severity="secondary" (onClick)="openNew()" />
                </ng-template>
                <ng-template #end>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="البحث ..." />
                    </p-iconfield>
                </ng-template>
            </p-toolbar>

            <div class="flex flex-wrap gap-2 items-end mb-4" dir="rtl">
                <div class="w-full md:w-6">
                    <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">البحث عن طريق الوحدة الادارية</label>
                    <p-select
                        styleClass="w-full"
                        [options]="managementUnits()"
                        optionLabel="path"
                        optionValue="id"
                        [filter]="true"
                        filterBy="path"
                        [showClear]="true"
                        placeholder="يرجى الاختيار"
                        [(ngModel)]="muFilterDraftId"
                        fluid
                    ></p-select>
                </div>
                <div>
                    <p-button label="بحث" icon="pi pi-search" severity="success" (onClick)="applyMuFilter()" />
                </div>
            </div>

            <p-table
                #dt
                [value]="rows()"
                [rows]="20"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                [globalFilterFields]="['securityFileName', 'orgNameName', 'note', 'muPath', 'nickName']"
                [tableStyle]="{ 'min-width': '72rem' }"
                currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords}"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[20, 50, 100]"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 12rem">تعديل / حذف</th>
                        <th style="width: 5rem">التسلسل</th>
                        <th style="width: 14rem">الملف </th>
                        <th style="width: 14rem">التنظيم</th>
                        <th style="width: 20rem">التفاصيل | الملاحظات</th>
                        <th style="width: 22rem">الوحدة الأدارية</th>
                        <th style="width: 14rem">الأضافة بواسطة</th>
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
                        <td class="text-surface-700 dark:text-surface-200">{{ row.securityFileName || '-' }}</td>
                        <td class="font-medium text-surface-900 dark:text-surface-0">{{ row.orgNameName || '-' }}</td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.note || '-' }}</td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.muPath || '-' }}</td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.nickName || '-' }}</td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="7" class="text-center text-surface-600 dark:text-surface-300">لا توجد تنظيمات مضافة.</td>
                    </tr>
                </ng-template>
            </p-table>

            <p-dialog
                [(visible)]="itemDialog"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: '60rem' }"
                header="واجهة اضافة اورك"
            >
                <div class="flex flex-col gap-4" dir="rtl">
                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">الملف </label>
                        <div class="flex gap-2">
                            <p-select
                                styleClass="w-full"
                                [options]="securityFiles()"
                                optionLabel="name"
                                [filter]="true"
                                filterBy="name"
                                [showClear]="true"
                                placeholder="يرجى الاختيار"
                                [(ngModel)]="selected.securityFile"
                                (ngModelChange)="onSecurityFileChanged()"
                                fluid
                            ></p-select>
                            <p-button
                                icon="pi pi-plus"
                                severity="secondary"
                                [outlined]="true"
                                (onClick)="openSecurityFileDialog()"
                                title="إضافة ملف عسكري"
                            />
                            <p-button
                                icon="pi pi-trash"
                                severity="danger"
                                [outlined]="true"
                                (onClick)="confirmDeleteSecurityFile()"
                                [disabled]="!selected.securityFile"
                                title="حذف الملف العسكري"
                            />
                        </div>
                        <small class="text-red-500" *ngIf="submitted && !selected.securityFile">يرجى الإختيار الملف </small>
                    </div>

                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">التنظيم</label>
                        <div class="flex gap-2">
                            <p-select
                                styleClass="w-full"
                                [options]="orgNameOptions()"
                                optionLabel="name"
                                [filter]="true"
                                filterBy="name"
                                [showClear]="true"
                                placeholder="يرجى الاختيار"
                                [(ngModel)]="selected.orgName"
                                fluid
                            ></p-select>
                            <p-button
                                icon="pi pi-plus"
                                severity="secondary"
                                [outlined]="true"
                                (onClick)="openOrgNameDialog()"
                                [disabled]="!selected.securityFile"
                                title="إضافة تنظيم"
                            />
                            <p-button
                                icon="pi pi-trash"
                                severity="danger"
                                [outlined]="true"
                                (onClick)="confirmDeleteOrgName()"
                                [disabled]="!selected.orgName"
                                title="حذف التنظيم"
                            />
                        </div>
                        <small class="text-red-500" *ngIf="submitted && !selected.orgName">يرجى اختيار التنظيم</small>
                    </div>

                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">الوحدة الأدارية</label>
                        <p-select
                            styleClass="w-full"
                            [options]="managementUnits()"
                            optionLabel="path"
                            optionValue="id"
                            [filter]="true"
                            filterBy="path"
                            [showClear]="true"
                            placeholder="يرجى الاختيار"
                            [(ngModel)]="selected.muId"
                            fluid
                        ></p-select>
                    </div>

                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">التفاصيل والملاحظات</label>
                        <textarea pInputTextarea class="w-full" [(ngModel)]="selected.note" maxlength="250" rows="4"></textarea>
                    </div>

                    <p-divider />

                    <div class="flex justify-end gap-2">
                        <p-button label="الغاء" severity="secondary" [outlined]="true" (onClick)="hideDialog()" />
                        <p-button label="حفظ" icon="pi pi-check" (onClick)="save()" />
                    </div>
                </div>
            </p-dialog>

            <p-dialog
                [(visible)]="securityFileDialog"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: '34rem' }"
                header="اضافة الملف "
            >
                <div class="flex flex-col gap-4" dir="rtl">
                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">اسم الملف </label>
                        <input pInputText type="text" class="w-full" [(ngModel)]="securityFileDraftName" maxlength="255" />
                        <small class="text-red-500" *ngIf="securityFileSubmitted && !securityFileDraftName.trim()">يرجى ملئ حقل اسم الملف </small>
                    </div>

                    <div class="flex justify-end gap-2">
                        <p-button label="الغاء" severity="secondary" [outlined]="true" (onClick)="closeSecurityFileDialog()" />
                        <p-button label="حفظ" icon="pi pi-check" (onClick)="saveSecurityFile()" />
                    </div>
                </div>
            </p-dialog>

            <p-dialog
                [(visible)]="orgNameDialog"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: '34rem' }"
                header="اضافة تنظيم"
            >
                <div class="flex flex-col gap-4" dir="rtl">
                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">اسم التنظيم</label>
                        <input pInputText type="text" class="w-full" [(ngModel)]="orgNameDraftName" maxlength="255" />
                        <small class="text-red-500" *ngIf="orgNameSubmitted && !orgNameDraftName.trim()">يرجى ملئ حقل اسم التنظيم</small>
                        <small class="text-surface-600 dark:text-surface-300" *ngIf="selected.securityFile">التنظيم الذي سوف تدخله تابع الى {{ selected.securityFile.name }}</small>
                    </div>

                    <div class="flex justify-end gap-2">
                        <p-button label="الغاء" severity="secondary" [outlined]="true" (onClick)="closeOrgNameDialog()" />
                        <p-button label="حفظ" icon="pi pi-check" (onClick)="saveOrgName()" />
                    </div>
                </div>
            </p-dialog>
        </div>
    `
})
export class SettingsOrg {
    @ViewChild('dt') dt?: Table;

    securityFiles = signal<SecurityFile[]>([
        { id: 1, name: 'الملف  1' },
        { id: 2, name: 'الملف  2' }
    ]);

    orgNames = signal<OrgName[]>([
        { id: 1, name: 'تنظيم 1', securityFileId: 1 },
        { id: 2, name: 'تنظيم 2', securityFileId: 1 },
        { id: 3, name: 'تنظيم 3', securityFileId: 2 }
    ]);

    managementUnits = signal<ManagementUnit[]>([
        { id: 1, path: 'العراق / بغداد' },
        { id: 2, path: 'العراق / الانبار' },
        { id: 3, path: 'العراق / نينوى' }
    ]);

    items = signal<Organization[]>([
        {
            id: 1,
            securityFile: { id: 1, name: 'الملف  1' },
            orgName: { id: 1, name: 'تنظيم 1', securityFileId: 1 },
            note: 'ملاحظة 1',
            muId: 1,
            nickName: 'مستخدم 1'
        },
        {
            id: 2,
            securityFile: { id: 2, name: 'الملف  2' },
            orgName: { id: 3, name: 'تنظيم 3', securityFileId: 2 },
            note: '',
            muId: 2,
            nickName: 'مستخدم 2'
        }
    ]);

    muFilterDraftId: number | null = null;
    private muFilterAppliedId = signal<number | null>(null);

    orgNameOptions = computed<OrgName[]>(() => {
        const secId = this.selected.securityFile?.id;
        if (!secId) {
            return [];
        }
        return this.orgNames().filter((o) => o.securityFileId === secId);
    });

    rows = computed<OrganizationRow[]>(() => {
        const muFilter = this.muFilterAppliedId();
        const muMap = new Map<number, string>(this.managementUnits().map((m) => [m.id, m.path]));

        let list = this.items();
        if (muFilter) {
            list = list.filter((it) => it.muId === muFilter);
        }

        return list.map((it) => ({
            ...it,
            securityFileName: it.securityFile?.name ?? '',
            orgNameName: it.orgName?.name ?? '',
            muPath: it.muId ? muMap.get(it.muId) ?? '' : ''
        }));
    });

    itemDialog = false;
    submitted = false;

    selected: Organization = {
        id: 0,
        securityFile: null as unknown as SecurityFile,
        orgName: null as unknown as OrgName,
        note: '',
        muId: null,
        nickName: ''
    };

    securityFileDialog = false;
    securityFileSubmitted = false;
    securityFileDraftName = '';

    orgNameDialog = false;
    orgNameSubmitted = false;
    orgNameDraftName = '';

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    applyMuFilter(): void {
        this.muFilterAppliedId.set(this.muFilterDraftId || null);
    }

    openNew(): void {
        this.selected = {
            id: 0,
            securityFile: null as unknown as SecurityFile,
            orgName: null as unknown as OrgName,
            note: '',
            muId: null,
            nickName: 'مستخدم'
        };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: OrganizationRow): void {
        this.selected = {
            id: row.id,
            securityFile: row.securityFile,
            orgName: row.orgName,
            note: row.note ?? '',
            muId: row.muId ?? null,
            nickName: row.nickName ?? ''
        };
        this.submitted = false;
        this.itemDialog = true;
    }

    hideDialog(): void {
        this.itemDialog = false;
        this.submitted = false;
    }

    onSecurityFileChanged(): void {
        const secId = this.selected.securityFile?.id;
        if (!secId) {
            this.selected.orgName = null as unknown as OrgName;
            return;
        }

        if (this.selected.orgName && this.selected.orgName.securityFileId !== secId) {
            this.selected.orgName = null as unknown as OrgName;
        }
    }

    save(): void {
        this.submitted = true;

        if (!this.selected.securityFile || !this.selected.orgName) {
            return;
        }

        const note = (this.selected.note || '').trim();
        const securityFile = this.selected.securityFile;
        const orgName = this.selected.orgName;
        const muId = this.selected.muId ?? null;
        const nickName = (this.selected.nickName || '').trim() || 'مستخدم';

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) =>
                    it.id === this.selected.id ? { ...it, securityFile, orgName, note, muId, nickName } : it
                )
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث اورك.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, securityFile, orgName, note, muId, nickName }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة اورك.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: OrganizationRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف اورك.' });
            }
        });
    }

    confirmDeleteSecurityFile(): void {
        const current = this.selected.securityFile;
        if (!current) {
            return;
        }

        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'حذف',
            rejectLabel: 'الغاء',
            accept: () => {
                const deletedId = current.id;
                this.securityFiles.update((list) => list.filter((s) => s.id !== deletedId));
                this.orgNames.update((list) => list.filter((o) => o.securityFileId !== deletedId));
                this.items.update((list) => list.filter((it) => it.securityFile.id !== deletedId));
                this.selected.securityFile = null as unknown as SecurityFile;
                this.selected.orgName = null as unknown as OrgName;
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الملف .' });
            }
        });
    }

    confirmDeleteOrgName(): void {
        const current = this.selected.orgName;
        if (!current) {
            return;
        }

        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'حذف',
            rejectLabel: 'الغاء',
            accept: () => {
                const deletedId = current.id;
                this.orgNames.update((list) => list.filter((o) => o.id !== deletedId));
                this.items.update((list) => list.filter((it) => it.orgName.id !== deletedId));
                this.selected.orgName = null as unknown as OrgName;
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف التنظيم.' });
            }
        });
    }

    openSecurityFileDialog(): void {
        this.securityFileDraftName = '';
        this.securityFileSubmitted = false;
        this.securityFileDialog = true;
    }

    closeSecurityFileDialog(): void {
        this.securityFileDialog = false;
        this.securityFileSubmitted = false;
    }

    saveSecurityFile(): void {
        this.securityFileSubmitted = true;
        const name = (this.securityFileDraftName || '').trim();
        if (!name) {
            return;
        }

        const nextId = this.nextId(this.securityFiles());
        const newItem: SecurityFile = { id: nextId, name };
        this.securityFiles.update((list) => [...list, newItem]);
        this.selected.securityFile = newItem;
        this.onSecurityFileChanged();

        this.securityFileDialog = false;
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الملف .' });
    }

    openOrgNameDialog(): void {
        if (!this.selected.securityFile) {
            return;
        }
        this.orgNameDraftName = '';
        this.orgNameSubmitted = false;
        this.orgNameDialog = true;
    }

    closeOrgNameDialog(): void {
        this.orgNameDialog = false;
        this.orgNameSubmitted = false;
    }

    saveOrgName(): void {
        this.orgNameSubmitted = true;
        const name = (this.orgNameDraftName || '').trim();
        if (!name || !this.selected.securityFile) {
            return;
        }

        const securityFileId = this.selected.securityFile.id;
        const nextId = this.nextId(this.orgNames());
        const newItem: OrgName = { id: nextId, name, securityFileId };

        this.orgNames.update((list) => [...list, newItem]);
        this.selected.orgName = newItem;

        this.orgNameDialog = false;
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة التنظيم.' });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId<T extends { id: number }>(items: T[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
