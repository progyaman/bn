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

interface Country {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    country: Country;
}

type CityRow = City & {
    countryName: string;
};

@Component({
    selector: 'app-settings-city',
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
    templateUrl: './city.html',
    styleUrl: './city.scss'
})
export class SettingsCity {
    @ViewChild('dt') dt?: Table;

    countries = signal<Country[]>([
        { id: 1, name: 'العراق' },
        { id: 2, name: 'الأردن' }
    ]);

    items = signal<City[]>([
        { id: 1, name: 'بغداد', country: { id: 1, name: 'العراق' } },
        { id: 2, name: 'البصرة', country: { id: 1, name: 'العراق' } }
    ]);

    rows = computed<CityRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            countryName: it.country?.name ?? ''
        }))
    );

    itemDialog = false;
    submitted = false;

    selected: City = { id: 0, name: '', country: null as unknown as Country };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', country: null as unknown as Country };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: CityRow): void {
        this.selected = {
            id: row.id,
            name: row.name,
            country: row.country
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
        if (!name || !this.selected.country) {
            return;
        }

        const country = this.selected.country;

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) => (it.id === this.selected.id ? { ...it, name, country } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث المحافظة.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, country }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة المحافظة.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: CityRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف المحافظة.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: City[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
