import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

type StatCard = {
    label: string;
    value: number;
    icon: string;
};

type SelectOption = { label: string; value: string };

@Component({
    selector: 'infograph-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, SelectModule, DatePickerModule],
    template: `
        <div class="flex flex-col gap-6" dir="rtl">
            <div class="flex items-center justify-between">
                <div class="font-semibold text-xl">الحصاد</div>
                <p-button icon="pi pi-filter" severity="secondary" (onClick)="isFilterOpen.set(true)" />
            </div>

            <div class="card">
                <div class="font-semibold mb-4">قائمة العدو</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <div class="card flex items-center justify-between" *ngFor="let item of enemyCards">
                        <div class="flex flex-col">
                            <div class="text-surface-500">{{ item.label }}</div>
                            <div class="text-2xl font-semibold">{{ item.value }}</div>
                        </div>
                        <i class="pi text-2xl text-surface-500" [ngClass]="item.icon"></i>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="font-semibold mb-4">قائمة الحشد</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <div class="card flex items-center justify-between" *ngFor="let item of hashdCards">
                        <div class="flex flex-col">
                            <div class="text-surface-500">{{ item.label }}</div>
                            <div class="text-2xl font-semibold">{{ item.value }}</div>
                        </div>
                        <i class="pi text-2xl text-surface-500" [ngClass]="item.icon"></i>
                    </div>
                </div>
            </div>

            <p-dialog header="نافذة البحث" [visible]="isFilterOpen()" (visibleChange)="isFilterOpen.set($event)" [modal]="true" [style]="{ width: '56rem' }">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">المهمة</label>
                        <p-select [(ngModel)]="filters.mission" [options]="missionOptions" optionLabel="label" optionValue="value" placeholder="يرجى الأختيار" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">تحديد بين تاريخين</label>
                        <p-datepicker [(ngModel)]="filters.dateRange" selectionMode="range" [showButtonBar]="true" class="w-full" />
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex justify-end gap-2">
                        <p-button label="بحث" icon="pi pi-check" (onClick)="applyFilters()" />
                        <p-button label="الغاء" icon="pi pi-times" severity="secondary" (onClick)="isFilterOpen.set(false)" />
                    </div>
                </ng-template>
            </p-dialog>
        </div>
    `
})
export class InfographDashboard {
    isFilterOpen = signal(false);

    missionOptions: SelectOption[] = [
        { label: 'يرجى الأختيار', value: '' },
        { label: 'مهمة 1', value: 'm1' },
        { label: 'مهمة 2', value: 'm2' },
        { label: 'مهمة 3', value: 'm3' }
    ];

    filters = {
        mission: '',
        dateRange: null as any
    };

    enemyCards: StatCard[] = [
        { label: 'قتل', value: 120, icon: 'pi-times-circle' },
        { label: 'جرح', value: 85, icon: 'pi-exclamation-triangle' },
        { label: 'أسر', value: 14, icon: 'pi-lock' },
        { label: 'آليات', value: 33, icon: 'pi-truck' },
        { label: 'أسلحة', value: 96, icon: 'pi-briefcase' },
        { label: 'مخازن', value: 7, icon: 'pi-database' }
    ];

    hashdCards: StatCard[] = [
        { label: 'قتل', value: 18, icon: 'pi-user-minus' },
        { label: 'جرح', value: 41, icon: 'pi-user-edit' },
        { label: 'تدمير', value: 9, icon: 'pi-ban' },
        { label: 'مضبوطات', value: 57, icon: 'pi-inbox' },
        { label: 'مبالغ', value: 12, icon: 'pi-wallet' },
        { label: 'وثائق', value: 44, icon: 'pi-file' }
    ];

    applyFilters() {
        this.isFilterOpen.set(false);
    }
}
