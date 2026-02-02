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
    templateUrl: './typeOrgName.html',
    styleUrl: './typeOrgName.scss'
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
