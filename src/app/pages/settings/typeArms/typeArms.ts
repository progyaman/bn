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
    templateUrl: './typeArms.html',
    styleUrl: './typeArms.scss'
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
