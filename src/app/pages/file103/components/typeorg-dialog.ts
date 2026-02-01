import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-typeorg-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
    template: `
        <p-dialog [(visible)]="visible" [modal]="true" [draggable]="false" [resizable]="false" header="إضافة نوع نشاط" [style]="{ width: '32rem' }">
            <div class="grid grid-cols-12 gap-4" dir="rtl">
                <div class="col-span-12">
                    <label class="block font-medium mb-2">اسم نوع النشاط</label>
                    <input pInputText [(ngModel)]="name" class="w-full" placeholder="أدخل الاسم" />
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
export class TypeOrgDialog {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Output() saved = new EventEmitter<string>();

    name = '';

    onCancel() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    onSave() {
        const value = this.name.trim();
        if (!value) return;

        this.saved.emit(value);
        this.name = '';

        this.visible = false;
        this.visibleChange.emit(false);
    }
}
