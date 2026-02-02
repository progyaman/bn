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

interface District {
    id: number;
    name: string;
    city: City;
}

type DistrictRow = District & {
    cityName: string;
};

@Component({
    selector: 'app-settings-district',
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
    templateUrl: './district.html',
    styleUrl: './district.scss'
})
export class SettingsDistrict {
    @ViewChild('dt') dt?: Table;

    private readonly iraq: Country = { id: 1, name: 'العراق' };

    cities = signal<City[]>([
        { id: 1, name: 'بغداد', country: this.iraq },
        { id: 2, name: 'البصرة', country: this.iraq }
    ]);

    items = signal<District[]>([
        { id: 1, name: 'الكرخ', city: { id: 1, name: 'بغداد', country: this.iraq } },
        { id: 2, name: 'الرصافة', city: { id: 1, name: 'بغداد', country: this.iraq } }
    ]);

    rows = computed<DistrictRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            cityName: it.city?.name ?? ''
        }))
    );

    itemDialog = false;
    submitted = false;

    selected: District = { id: 0, name: '', city: null as unknown as City };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', city: null as unknown as City };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: DistrictRow): void {
        this.selected = {
            id: row.id,
            name: row.name,
            city: row.city
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
        if (!name || !this.selected.city) {
            return;
        }

        const city = this.selected.city;

        if (this.selected.id) {
            this.items.update((list) => list.map((it) => (it.id === this.selected.id ? { ...it, name, city } : it)));
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث القضاء.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, city }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة القضاء.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: DistrictRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف القضاء.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: District[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
