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

interface OrgOption {
    id: number;
    name: string;
}

interface ActivityType {
    id: number;
    name: string;
    orgIds: number[];
}

type ActivityTypeRow = ActivityType & {
    orgsLabel: string;
};

@Component({
    selector: 'app-settings-activitytype',
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
        MultiSelectModule,
        DividerModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './activitytype.html',
    styleUrl: './activitytype.scss'
})
export class SettingsActivityType {
    @ViewChild('dt') dt?: Table;

    private readonly orgsById = new Map<number, string>();

    orgOptions: OrgOption[] = [
        { id: 1, name: 'جهة 1' },
        { id: 2, name: 'جهة 2' },
        { id: 3, name: 'جهة 3' }
    ];

    activityTypes = signal<ActivityType[]>([
        { id: 1, name: 'نشاط 1', orgIds: [1] },
        { id: 2, name: 'نشاط 2', orgIds: [1, 2] }
    ]);

    rows = computed<ActivityTypeRow[]>(() => {
        return this.activityTypes().map((t) => ({
            ...t,
            orgsLabel: this.formatOrgNames(t.orgIds)
        }));
    });

    activityTypeDialog = false;
    submitted = false;

    activityType: ActivityType = {
        id: 0,
        name: '',
        orgIds: []
    };

    get dialogTitle(): string {
        return this.activityType?.id ? 'تعديل نوع النشاط' : 'إضافة نوع نشاط';
    }

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {
        this.rebuildOrgsIndex();
    }

    openNew(): void {
        this.activityType = { id: 0, name: '', orgIds: [] };
        this.submitted = false;
        this.activityTypeDialog = true;
    }

    editRow(row: ActivityTypeRow): void {
        this.activityType = { id: row.id, name: row.name, orgIds: [...row.orgIds] };
        this.submitted = false;
        this.activityTypeDialog = true;
    }

    hideDialog(): void {
        this.activityTypeDialog = false;
        this.submitted = false;
    }

    save(): void {
        this.submitted = true;

        const name = (this.activityType.name || '').trim();
        if (!name) {
            return;
        }

        const orgIds = Array.isArray(this.activityType.orgIds) ? this.activityType.orgIds : [];

        if (this.activityType.id) {
            this.activityTypes.update((items) =>
                items.map((it) => (it.id === this.activityType.id ? { ...it, name, orgIds: [...orgIds] } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث نوع النشاط.' });
        } else {
            const nextId = this.nextId(this.activityTypes());
            this.activityTypes.update((items) => [...items, { id: nextId, name, orgIds: [...orgIds] }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة نوع النشاط.' });
        }

        this.activityTypeDialog = false;
    }

    confirmDelete(row: ActivityTypeRow): void {
        this.confirmationService.confirm({
            message: `هل أنت متأكد من حذف "${row.name}"؟`,
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'حذف',
            rejectLabel: 'إلغاء',
            accept: () => {
                this.activityTypes.update((items) => items.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف نوع النشاط.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private rebuildOrgsIndex(): void {
        this.orgsById.clear();
        for (const org of this.orgOptions) {
            this.orgsById.set(org.id, org.name);
        }
    }

    private formatOrgNames(orgIds: number[] | null | undefined): string {
        if (!orgIds?.length) {
            return '';
        }

        return orgIds
            .map((id) => this.orgsById.get(id))
            .filter((name): name is string => Boolean(name))
            .join('، ');
    }

    private nextId(items: ActivityType[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
