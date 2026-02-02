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

interface HandDistrict {
    id: number;
    name: string;
    district: District;
}

type HandDistrictRow = HandDistrict & {
    districtName: string;
    cityName: string;
};

@Component({
    selector: 'app-settings-handdistrict',
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
    templateUrl: './handdistrict.html',
    styleUrl: './handdistrict.scss'
})
export class SettingsHandDistrict {
    @ViewChild('dt') dt?: Table;

    private readonly iraq: Country = { id: 1, name: 'العراق' };
    private readonly baghdad: City = { id: 1, name: 'بغداد', country: this.iraq };

    districts = signal<District[]>([
        { id: 1, name: 'الكرخ', city: this.baghdad },
        { id: 2, name: 'الرصافة', city: this.baghdad }
    ]);

    items = signal<HandDistrict[]>([
        { id: 1, name: 'ناحية 1', district: { id: 1, name: 'الكرخ', city: this.baghdad } },
        { id: 2, name: 'ناحية 2', district: { id: 2, name: 'الرصافة', city: this.baghdad } }
    ]);

    rows = computed<HandDistrictRow[]>(() =>
        this.items().map((it) => ({
            ...it,
            districtName: it.district?.name ?? '',
            cityName: it.district?.city?.name ?? ''
        }))
    );

    itemDialog = false;
    submitted = false;

    selected: HandDistrict = { id: 0, name: '', district: null as unknown as District };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, name: '', district: null as unknown as District };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: HandDistrictRow): void {
        this.selected = { id: row.id, name: row.name, district: row.district };
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
        if (!name || !this.selected.district) {
            return;
        }

        const district = this.selected.district;

        if (this.selected.id) {
            this.items.update((list) => list.map((it) => (it.id === this.selected.id ? { ...it, name, district } : it)));
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث الناحية.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, name, district }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الناحية.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: HandDistrictRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الناحية.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: HandDistrict[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
