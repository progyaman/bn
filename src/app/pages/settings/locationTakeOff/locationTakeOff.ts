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

interface LocationTakeOff {
    id: number;
    name: string;
}

@Component({
    selector: 'app-settings-location-takeoff',
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
    templateUrl: './locationTakeOff.html',
    styleUrl: './locationTakeOff.scss'
})
export class SettingsLocationTakeOff {
    @ViewChild('dt') dt?: Table;

    items = signal<LocationTakeOff[]>([
        { id: 1, name: 'موقع 1' },
        { id: 2, name: 'موقع 2' }
    ]);

    itemDialog = false;
    submitted = false;

    selected: LocationTakeOff = { id: 0, name: '' };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '' };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: LocationTakeOff): void {
        this.selected = { id: row.id, name: row.name };
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
            this.items.update((list) => list.map((it) => (it.id === this.selected.id ? { ...it, name } : it)));
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث موقع الأقلاع.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة موقع الأقلاع.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: LocationTakeOff): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف موقع الأقلاع.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: LocationTakeOff[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
