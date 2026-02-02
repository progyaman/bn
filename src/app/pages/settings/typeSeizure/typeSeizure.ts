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

interface CategorySeizure {
    id: number;
    name: string;
}

interface TypeSeizure {
    id: number;
    name: string;
    categorySeizure: CategorySeizure;
}

type TypeSeizureRow = TypeSeizure & {
    categoryName: string;
};

@Component({
    selector: 'app-settings-type-seizure',
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
    templateUrl: './typeSeizure.html',
    styleUrl: './typeSeizure.scss'
})
export class SettingsTypeSeizure {
    @ViewChild('dt') dt?: Table;

    categories = signal<CategorySeizure[]>([
        { id: 1, name: 'تصنيف 1' },
        { id: 2, name: 'تصنيف 2' }
    ]);

    items = signal<TypeSeizure[]>([
        { id: 1, name: 'نوع 1', categorySeizure: { id: 1, name: 'تصنيف 1' } },
        { id: 2, name: 'نوع 2', categorySeizure: { id: 2, name: 'تصنيف 2' } }
    ]);

    rows = computed<TypeSeizureRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            categoryName: it.categorySeizure?.name ?? ''
        }))
    );

    itemDialog = false;
    submitted = false;

    selected: TypeSeizure = {
        id: 0,
        name: '',
        categorySeizure: null as unknown as CategorySeizure
    };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', categorySeizure: null as unknown as CategorySeizure };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: TypeSeizureRow): void {
        this.selected = { id: row.id, name: row.name, categorySeizure: row.categorySeizure };
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
        if (!name || !this.selected.categorySeizure) {
            return;
        }

        const categorySeizure = this.selected.categorySeizure;

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) => (it.id === this.selected.id ? { ...it, name, categorySeizure } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث نوع المضبوطات.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, categorySeizure }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة نوع المضبوطات.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: TypeSeizureRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف نوع المضبوطات.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: TypeSeizure[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
