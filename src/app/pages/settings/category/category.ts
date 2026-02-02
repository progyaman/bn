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
import { SelectButtonModule } from 'primeng/selectbutton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface CategorySeizure {
    id: number;
    name: string;
    receipt: boolean;
}

@Component({
    selector: 'app-settings-category',
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
        SelectButtonModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './category.html',
    styleUrl: './category.scss'
})
export class SettingsCategory {
    @ViewChild('dt') dt?: Table;

    receiptOptions = [
        { label: 'كلا', value: false },
        { label: 'نعم', value: true }
    ];

    items = signal<CategorySeizure[]>([
        { id: 1, name: 'تصنيف 1', receipt: true },
        { id: 2, name: 'تصنيف 2', receipt: false }
    ]);

    itemDialog = false;
    submitted = false;

    selected: CategorySeizure = { id: 0, name: '', receipt: false };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', receipt: false };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: CategorySeizure): void {
        this.selected = { id: row.id, name: row.name, receipt: row.receipt };
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
                list.map((it) => (it.id === this.selected.id ? { ...it, name, receipt: this.selected.receipt } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث تصنيف المضبوطات.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, receipt: this.selected.receipt }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة تصنيف المضبوطات.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: CategorySeizure): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف تصنيف المضبوطات.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: CategorySeizure[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
