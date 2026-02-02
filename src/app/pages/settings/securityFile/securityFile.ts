import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface OrgName {
    id: number;
    name: string;
}

interface SecurityFile {
    id: number;
    name: string;
    orgNames: OrgName[];
}

@Component({
    selector: 'app-settings-security-file',
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
        DividerModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './securityFile.html',
    styleUrl: './securityFile.scss'
})
export class SettingsSecurityFile {
    @ViewChild('dt') dt?: Table;

    items = signal<SecurityFile[]>([
        {
            id: 1,
            name: 'ملف أمني 1',
            orgNames: [
                { id: 1, name: 'تنظيم 1' },
                { id: 2, name: 'تنظيم 2' }
            ]
        },
        {
            id: 2,
            name: 'ملف أمني 2',
            orgNames: []
        }
    ]);

    itemDialog = false;
    submitted = false;

    selected: SecurityFile = { id: 0, name: '', orgNames: [] };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', orgNames: [] };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: SecurityFile): void {
        this.selected = { id: row.id, name: row.name, orgNames: row.orgNames ?? [] };
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
        if (!name) {
            return;
        }

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) => (it.id === this.selected.id ? { ...it, name } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث الملف الأمني.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, orgNames: [] }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الملف الأمني.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: SecurityFile): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الملف الأمني.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: SecurityFile[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
