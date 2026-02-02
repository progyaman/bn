import { CommonModule } from '@angular/common';
import { Component, computed, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface CoordinateType {
    id: number;
    typeName: string;
    typeIcon: string; // PrimeIcon class name e.g. 'pi pi-map-marker'
}

interface Coordinate {
    id: number;
    name: string;
    coordinateTypeId: number;
    createDate: Date;
    nickName: string;
}

type CoordinateRow = Coordinate & {
    coordinateTypeName: string;
    coordinateTypeIcon: string;
};

@Component({
    selector: 'app-settings-coordinate',
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
        InputMaskModule,
        SelectModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './coordinate.html',
    styleUrl: './coordinate.scss'
})
export class SettingsCoordinate {
    @ViewChild('dt') dt?: Table;

    coordinateTypes = signal<CoordinateType[]>([
        { id: 1, typeName: 'نوع 1', typeIcon: 'pi pi-map-marker' },
        { id: 2, typeName: 'نوع 2', typeIcon: 'pi pi-compass' },
        { id: 3, typeName: 'نوع 3', typeIcon: 'pi pi-directions' }
    ]);

    items = signal<Coordinate[]>([
        { id: 1, name: '12A AA 12345 12345', coordinateTypeId: 1, createDate: new Date(), nickName: 'admin' },
        { id: 2, name: '34B BB 54321 67890', coordinateTypeId: 2, createDate: new Date(), nickName: 'user1' }
    ]);

    rows = computed<CoordinateRow[]>(() => {
        const typesById = new Map<number, CoordinateType>();
        for (const type of this.coordinateTypes()) {
            typesById.set(type.id, type);
        }

        return this.items().map((c) => {
            const type = typesById.get(c.coordinateTypeId);
            return {
                ...c,
                coordinateTypeName: type?.typeName ?? '',
                coordinateTypeIcon: type?.typeIcon ?? 'pi pi-map-marker'
            };
        });
    });

    itemDialog = false;
    submitted = false;

    selected: Coordinate = {
        id: 0,
        name: '',
        coordinateTypeId: 0,
        createDate: new Date(),
        nickName: ''
    };

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    goToCoordinateTypes(): void {
        this.router.navigate(['/settings/coordinate_type']);
    }

    openNew(): void {
        this.selected = { id: 0, name: '', coordinateTypeId: 0, createDate: new Date(), nickName: '' };
        this.submitted = false;
        this.itemDialog = true;
    }

    editRow(row: CoordinateRow): void {
        this.selected = {
            id: row.id,
            name: row.name,
            coordinateTypeId: row.coordinateTypeId,
            createDate: row.createDate,
            nickName: row.nickName
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
        if (!name || !this.selected.coordinateTypeId) {
            return;
        }

        if (this.selected.id) {
            this.items.update((list) =>
                list.map((it) =>
                    it.id === this.selected.id
                        ? {
                              ...it,
                              name,
                              coordinateTypeId: this.selected.coordinateTypeId
                          }
                        : it
                )
            );
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث الأحداثي الجغرافي.' });
        } else {
            const nextId = this.nextId(this.items());
            this.items.update((list) => [
                ...list,
                {
                    id: nextId,
                    name,
                    coordinateTypeId: this.selected.coordinateTypeId,
                    createDate: new Date(),
                    nickName: 'admin'
                }
            ]);
            this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة أحداثي.' });
        }

        this.itemDialog = false;
    }

    confirmDelete(row: CoordinateRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.items.update((list) => list.filter((it) => it.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الأحداثي.' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement | null;
        table.filterGlobal(input?.value ?? '', 'contains');
    }

    private nextId(items: Coordinate[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }
}
