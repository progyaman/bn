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

interface ArmsType {
    id: number;
    nameArms: ArmsGroup;
    name: string;
}

interface NameOrSymbol {
    id: number;
    typeArms: ArmsType;
    name: string;
}

type NameOrSymbolRow = NameOrSymbol & {
    armsGroupName: string;
    armsTypeName: string;
};

@Component({
    selector: 'app-settings-name-or-symbol',
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
    templateUrl: './nameOrSymbol.html',
    styleUrl: './nameOrSymbol.scss'
})
export class SettingsNameOrSymbol {
    @ViewChild('dt') dt?: Table;

    armsGroups: ArmsGroup[] = ['ميداني', 'علني', 'فني', 'رسمي', 'سري', 'عكسي'];

    types = signal<ArmsType[]>([
        { id: 1, nameArms: 'ميداني', name: 'نوع ميداني 1' },
        { id: 2, nameArms: 'ميداني', name: 'نوع ميداني 2' },
        { id: 3, nameArms: 'علني', name: 'نوع علني 1' },
        { id: 4, nameArms: 'فني', name: 'نوع فني 1' },
        { id: 5, nameArms: 'رسمي', name: 'نوع رسمي 1' },
        { id: 6, nameArms: 'سري', name: 'نوع سري 1' },
        { id: 7, nameArms: 'عكسي', name: 'نوع عكسي 1' }
    ]);

    items = signal<NameOrSymbol[]>([
        { id: 1, typeArms: { id: 1, nameArms: 'ميداني', name: 'نوع ميداني 1' }, name: 'رمز 1' },
        { id: 2, typeArms: { id: 3, nameArms: 'علني', name: 'نوع علني 1' }, name: 'اسم 2' }
    ]);

    rows = computed<NameOrSymbolRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            armsGroupName: it.typeArms?.nameArms ?? '',
            armsTypeName: it.typeArms?.name ?? ''
        }))
    );

    itemDialog = false;
    submitted = false;

    selectedArmsGroup: ArmsGroup | null = null;

    selected: NameOrSymbol = {
        id: 0,
        typeArms: null as unknown as ArmsType,
        name: ''
    };

    availableTypes = computed<ArmsType[]>(() => {
        if (!this.selectedArmsGroup) {
            return [];
        }
        return this.types().filter((t) => t.nameArms === this.selectedArmsGroup);
    });

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, typeArms: null as unknown as ArmsType, name: '' };
        this.selectedArmsGroup = null;
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: NameOrSymbolRow): void {
        this.selected = {
            id: row.id,
            typeArms: row.typeArms,
            name: row.name
        };
        this.selectedArmsGroup = row.typeArms?.nameArms ?? null;
        this.submitted = false;
        this.itemDialog = true;
    }

    onArmsGroupChange(group: ArmsGroup | null): void {
        this.selectedArmsGroup = group;
        this.selected.typeArms = null as unknown as ArmsType;
    }

    hideDialog(): void {
        this.itemDialog = false;
        this.submitted = false;
    }

    save(): void {
        this.submitted = true;

        const name = (this.selected.name || '').trim();
        if (!name || !this.selectedArmsGroup || !this.selected.typeArms) {
            return;
        }

        const typeArms = this.selected.typeArms;

        if (this.selected.id) {
            this.items.update((list) => list.map((it) => (it.id === this.selected.id ? { ...it, name, typeArms } : it)));
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث الاسم/الرمز.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, typeArms }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الاسم/الرمز.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: NameOrSymbolRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الاسم/الرمز.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: NameOrSymbol[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
