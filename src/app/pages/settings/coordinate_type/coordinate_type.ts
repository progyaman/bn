import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface CoordinateType {
    id: number;
    typeName: string;
    typeIcon: string; // PrimeIcon class name
    createDate: Date;
}

interface IconOption {
    icon: string;
    label: string;
}

@Component({
    selector: 'app-settings-coordinate-type',
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
        DataViewModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './coordinate_type.html',
    styleUrl: './coordinate_type.scss'
})
export class SettingsCoordinateType {
    @ViewChild('dt') dt?: Table;

    iconOptions: IconOption[] = [
        { icon: 'pi pi-map-marker', label: 'Map Marker' },
        { icon: 'pi pi-compass', label: 'Compass' },
        { icon: 'pi pi-directions', label: 'Directions' },
        { icon: 'pi pi-flag', label: 'Flag' },
        { icon: 'pi pi-location-arrow', label: 'Location Arrow' },
        { icon: 'pi pi-globe', label: 'Globe' },
        { icon: 'pi pi-crosshairs', label: 'Crosshairs' },
        { icon: 'pi pi-map', label: 'Map' }
    ];

    items = signal<CoordinateType[]>([
        { id: 1, typeName: 'نوع 1', typeIcon: 'pi pi-map-marker', createDate: new Date() },
        { id: 2, typeName: 'نوع 2', typeIcon: 'pi pi-compass', createDate: new Date() }
    ]);

    itemDialog = false;
    submitted = false;

    selected: CoordinateType = { id: 0, typeName: '', typeIcon: '', createDate: new Date() };

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    openNew(): void {
        this.selected = { id: 0, typeName: '', typeIcon: '', createDate: new Date() };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: CoordinateType): void {
        this.selected = { id: row.id, typeName: row.typeName, typeIcon: row.typeIcon, createDate: row.createDate };
        this.submitted = false;
        this.itemDialog = true;
    }

    selectIcon(icon: string): void {
        this.selected.typeIcon = icon;
    }

    hideDialog(): void {
        this.itemDialog = false;
        this.submitted = false;
    }

    save(): void {
        this.submitted = true;

        const typeName = (this.selected.typeName || '').trim();
        if (!typeName || !this.selected.typeIcon) {
            return;
        }

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) => (it.id === this.selected.id ? { ...it, typeName, typeIcon: this.selected.typeIcon } : it))
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث نوع الاحداثي.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [...list, { id: nextId, typeName, typeIcon: this.selected.typeIcon, createDate: new Date() }]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة نوع احداثي.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: CoordinateType): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف نوع الاحداثي.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: CoordinateType[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
