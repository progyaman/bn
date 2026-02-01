import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';

interface File103LostModel {
    killed?: number | null;
    injured?: number | null;
    missing?: number | null;

    residentialHouses?: number | null;
    schools?: number | null;
    hospitals?: number | null;

    vehicles?: number | null;
    agricultural?: number | null;
    industrial?: number | null;

    note?: string;
}

@Component({
    selector: 'app-file103-lost',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, FieldsetModule, InputNumberModule, TextareaModule],
    template: `
        <div dir="rtl">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">النتائج</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">ملف 103</div>
                </div>
                <div class="flex gap-2">
                    <p-button type="button" label="فتح نافذة النتائج" icon="pi pi-external-link" (onClick)="visible.set(true)" />
                </div>
            </div>

            <p-dialog
                [visible]="visible()"
                (visibleChange)="visible.set($event)"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                [style]="{ width: 'min(980px, 96vw)' }"
                header="النتائج"
            >
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-4">
                        <p-fieldset legend="خسائر بشرية">
                            <div class="flex flex-col gap-3">
                                <div>
                                    <label class="block font-medium mb-2">شهداء</label>
                                    <p-inputNumber [(ngModel)]="model.killed" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium mb-2">جرحى</label>
                                    <p-inputNumber [(ngModel)]="model.injured" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium mb-2">مفقودين</label>
                                    <p-inputNumber [(ngModel)]="model.missing" class="w-full" />
                                </div>
                            </div>
                        </p-fieldset>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <p-fieldset legend="خسائر مدنية">
                            <div class="flex flex-col gap-3">
                                <div>
                                    <label class="block font-medium mb-2">منازل</label>
                                    <p-inputNumber [(ngModel)]="model.residentialHouses" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium mb-2">مدارس</label>
                                    <p-inputNumber [(ngModel)]="model.schools" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium mb-2">مشافي</label>
                                    <p-inputNumber [(ngModel)]="model.hospitals" class="w-full" />
                                </div>
                            </div>
                        </p-fieldset>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <p-fieldset legend="خسائر مادية">
                            <div class="flex flex-col gap-3">
                                <div>
                                    <label class="block font-medium mb-2">آليات</label>
                                    <p-inputNumber [(ngModel)]="model.vehicles" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium mb-2">زراعية</label>
                                    <p-inputNumber [(ngModel)]="model.agricultural" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium mb-2">صناعية</label>
                                    <p-inputNumber [(ngModel)]="model.industrial" class="w-full" />
                                </div>
                            </div>
                        </p-fieldset>
                    </div>

                    <div class="col-span-12">
                        <p-fieldset legend="ملاحظات">
                            <textarea pTextarea [(ngModel)]="model.note" rows="4" class="w-full"></textarea>
                        </p-fieldset>
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex justify-end gap-2">
                        <p-button type="button" label="إغلاق" severity="secondary" (onClick)="visible.set(false)" />
                        <p-button type="button" label="حفظ" icon="pi pi-save" (onClick)="save()" />
                    </div>
                </ng-template>
            </p-dialog>
        </div>
    `
})
export class File103LostPage {
    visible = signal(true);

    model: File103LostModel = {
        killed: null,
        injured: null,
        missing: null,
        residentialHouses: null,
        schools: null,
        hospitals: null,
        vehicles: null,
        agricultural: null,
        industrial: null,
        note: ''
    };

    save() {
        // placeholder
        this.visible.set(false);
    }
}
