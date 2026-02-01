import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';

export interface CoordinateType {
    name: string;
}

export interface CoordinateModel {
    name: string;
    type: CoordinateType | null;
}

@Component({
    selector: 'app-coordinate-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputMaskModule, SelectModule],
    template: `
        <p-dialog [(visible)]="visible" [modal]="true" [draggable]="false" [resizable]="false" header="اضافة الأحداثي الجغرافي" [style]="{ width: '36rem' }">
            <div class="grid grid-cols-12 gap-4" dir="rtl">
                <div class="col-span-12">
                    <label class="block font-medium mb-2">اسم الأحداثي الجغرافي</label>
                    <p-inputmask
                        [(ngModel)]="model.name"
                        mask="99a aa 99999 99999"
                        [autoClear]="false"
                        placeholder="12A AA 12345 12345"
                        styleClass="w-full"
                        dir="ltr"
                    />
                    <div class="text-xs text-surface-600 dark:text-surface-300 mt-1" dir="ltr">12A AA 12345 12345 : يجب ان يكون النمط مثل</div>
                </div>

                <div class="col-span-12">
                    <label class="block font-medium mb-2">نوع الأحداثي</label>
                    <p-select [(ngModel)]="model.type" [options]="typeOptions" optionLabel="name" placeholder="يرجى الأختيار" class="w-full" />
                </div>
            </div>

            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2">
                    <p-button label="إلغاء" severity="secondary" (onClick)="onCancel()" />
                    <p-button label="حفظ" icon="pi pi-check" (onClick)="onSave()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class CoordinateDialog {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Output() saved = new EventEmitter<CoordinateModel>();

    model: CoordinateModel = { name: '', type: null };

    typeOptions: CoordinateType[] = [{ name: 'نوع 1' }, { name: 'نوع 2' }, { name: 'نوع 3' }];

    onCancel() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    onSave() {
        if (!this.model.name?.trim() || !this.model.type) return;

        this.saved.emit({ ...this.model });
        this.model = { name: '', type: null };

        this.visible = false;
        this.visibleChange.emit(false);
    }
}
