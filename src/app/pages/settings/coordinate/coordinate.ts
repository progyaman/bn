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
    template: `
        <div class="card" dir="rtl">
            <p-toast />
            <p-confirmdialog />

            <div class="flex flex-col gap-2 mb-6">
                <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">الأحداثي الجغرافي</div>
                <div class="text-surface-600 dark:text-surface-300 text-sm">إدارة الأحداثيات الجغرافية (إضافة / تعديل / حذف).</div>
            </div>

            <p-divider />

            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <div class="flex flex-wrap gap-2">
                        <p-button label="اضافة أحداثي" icon="pi pi-plus" severity="secondary" (onClick)="openNew()" />
                        <p-button label="اضافة نوع احداثي" icon="pi pi-plus" severity="secondary" [outlined]="true" (onClick)="goToCoordinateTypes()" />
                    </div>
                </ng-template>
                <ng-template #end>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="البحث ..." />
                    </p-iconfield>
                </ng-template>
            </p-toolbar>

            <p-table
                #dt
                [value]="rows()"
                [rows]="10"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                [globalFilterFields]="['name', 'coordinateTypeName', 'nickName']"
                [tableStyle]="{ 'min-width': '75rem' }"
                currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords}"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 20, 30]"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 12rem">تعـديــل / حــــذف</th>
                        <th style="width: 5rem">التسلسل</th>
                        <th>الأحداثي الجغرافي</th>
                        <th style="width: 14rem">النوع</th>
                        <th style="width: 8rem">الايقونة</th>
                        <th style="width: 12rem">تاريخ الأضافة</th>
                        <th style="width: 14rem">الأضافة بواسطة</th>
                    </tr>
                </ng-template>

                <ng-template #body let-row let-rowIndex="rowIndex">
                    <tr>
                        <td>
                            <div class="flex gap-2 justify-end">
                                <p-button icon="pi pi-pencil" severity="secondary" [text]="true" (onClick)="editRow(row)" />
                                <p-button icon="pi pi-trash" severity="danger" [text]="true" (onClick)="confirmDelete(row)" />
                            </div>
                        </td>
                        <td>{{ rowIndex + 1 }}</td>
                        <td class="font-medium text-surface-900 dark:text-surface-0">{{ row.name }}</td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.coordinateTypeName }}</td>
                        <td class="text-surface-700 dark:text-surface-200">
                            <i [class]="row.coordinateTypeIcon" aria-hidden="true"></i>
                        </td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.createDate | date: 'yyyy-MM-dd' }}</td>
                        <td class="text-surface-700 dark:text-surface-200">{{ row.nickName }}</td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="7" class="text-center text-surface-600 dark:text-surface-300">لا يوجد احداثي جغرافي.</td>
                    </tr>
                </ng-template>
            </p-table>

            <p-dialog
                [(visible)]="itemDialog"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: '48rem' }"
                header="نافذة اضافة الأحداثي الجغرافي"
            >
                <div class="flex flex-col gap-4" dir="rtl">
                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">اسم الأحداثي الجغرافي</label>
                        <p-inputMask
                            id="coordinate"
                            dir="ltr"
                            class="w-full"
                            mask="99a aa 99999 99999"
                            [autoClear]="false"
                            [(ngModel)]="selected.name"
                        />
                        <small class="block text-surface-600 dark:text-surface-300 mt-2" dir="ltr">12A AA 12345 12345 : يجب ان يكون النمط مثل</small>
                        <small class="text-red-500" *ngIf="submitted && !selected.name.trim()">يجب ملئ الحقل</small>
                    </div>

                    <div>
                        <label class="block font-medium text-surface-900 dark:text-surface-0 mb-2">نوع الأحداثي</label>
                        <p-select
                            class="w-full"
                            [options]="coordinateTypes()"
                            optionLabel="typeName"
                            optionValue="id"
                            [filter]="true"
                            filterPlaceholder="بحث..."
                            placeholder="يرجى الأختيار"
                            [(ngModel)]="selected.coordinateTypeId"
                        >
                            <ng-template #item let-opt>
                                <div class="flex items-center justify-between w-full">
                                    <span class="text-surface-900 dark:text-surface-0">{{ opt.typeName }}</span>
                                    <i [class]="opt.typeIcon" aria-hidden="true"></i>
                                </div>
                            </ng-template>
                        </p-select>
                        <small class="text-red-500" *ngIf="submitted && !selected.coordinateTypeId">يرجى الأختيار</small>
                    </div>

                    <p-divider />

                    <div class="flex justify-end gap-2">
                        <p-button label="الغاء" severity="secondary" [outlined]="true" (onClick)="hideDialog()" />
                        <p-button label="حفظ" icon="pi pi-check" (onClick)="save()" />
                    </div>
                </div>
            </p-dialog>
        </div>
    `
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
