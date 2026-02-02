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

interface SecurityFile {
    id: number;
    name: string;
}

interface OrgName {
    id: number;
    name: string;
    securityFile: SecurityFile;
}

type OrgNameRow = OrgName & {
    securityFileName: string;
};

@Component({
    selector: 'app-settings-org-name',
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
    templateUrl: './orgName.html',
    styleUrl: './orgName.scss'
})
export class SettingsOrgName {
    @ViewChild('dt') dt?: Table;

    securityFiles = signal<SecurityFile[]>([
        { id: 1, name: 'ملف أمني 1' },
        { id: 2, name: 'ملف أمني 2' }
    ]);

    items = signal<OrgName[]>([
        { id: 1, name: 'تنظيم 1', securityFile: { id: 1, name: 'ملف أمني 1' } },
        { id: 2, name: 'تنظيم 2', securityFile: { id: 2, name: 'ملف أمني 2' } }
    ]);

    rows = computed<OrgNameRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            securityFileName: it.securityFile?.name ?? ''
        }))
    );

    itemDialog = false;
    submitted = false;

    selected: OrgName = {
        id: 0,
        name: '',
        securityFile: null as unknown as SecurityFile
    };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', securityFile: null as unknown as SecurityFile };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: OrgNameRow): void {
        this.selected = {
            id: row.id,
            name: row.name,
            securityFile: row.securityFile
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
        if (!name || !this.selected.securityFile) {
            return;
        }

        const securityFile = this.selected.securityFile;

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) => (it.id === this.selected.id ? { ...it, name, securityFile } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث التنظيم.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, securityFile }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة التنظيم.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: OrgNameRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف التنظيم.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: OrgName[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
