import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { DISCOVER_REPORT_CONFIGS, DiscoverReportConfig } from './discover.data';

@Component({
    selector: 'app-discover-report',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        DatePickerModule,
        InputTextModule,
        TableModule,
        MultiSelectModule,
        SelectModule,
        SelectButtonModule
    ],
    template: `
        <div dir="rtl" class="card">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ title }}</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">الكشوفات</div>
                </div>
                <div class="flex gap-2">
                    <a class="p-button p-component p-button-secondary" routerLink="/discover/list">
                        <span class="p-button-icon pi pi-list"></span>
                        <span class="p-button-label">رجوع</span>
                    </a>
                    <a class="p-button p-component" [routerLink]="['/discover/print', key]">
                        <span class="p-button-icon pi pi-print"></span>
                        <span class="p-button-label">طباعة</span>
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-3 mb-4" *ngIf="config?.filters?.length">
                <ng-container *ngFor="let filter of (config?.filters ?? [])">
                    <div class="col-span-12 md:col-span-4">
                        <label class="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">{{ filter.label }}</label>
                        <ng-container [ngSwitch]="filter.type">
                            <p-datepicker
                                *ngSwitchCase="'date-range'"
                                [(ngModel)]="filterValues[filter.key]"
                                selectionMode="range"
                                [showButtonBar]="true"
                                class="w-full"
                            />
                            <p-select
                                *ngSwitchCase="'year'"
                                [(ngModel)]="filterValues[filter.key]"
                                [options]="toOptions(filter.options)"
                                placeholder="يرجى الاختيار"
                                class="w-full"
                            />
                            <p-multiselect
                                *ngSwitchCase="'multi'"
                                [(ngModel)]="filterValues[filter.key]"
                                [options]="toOptions(filter.options)"
                                defaultLabel="يرجى الاختيار"
                                class="w-full"
                            />
                            <p-select
                                *ngSwitchCase="'select'"
                                [(ngModel)]="filterValues[filter.key]"
                                [options]="toOptions(filter.options)"
                                placeholder="يرجى الاختيار"
                                class="w-full"
                            />
                            <p-selectButton
                                *ngSwitchCase="'toggle'"
                                [(ngModel)]="filterValues[filter.key]"
                                [options]="toOptions(filter.options)"
                                optionLabel="label"
                                optionValue="value"
                                [allowEmpty]="false"
                            />
                            <input *ngSwitchDefault pInputText [(ngModel)]="filterValues[filter.key]" class="w-full" />
                        </ng-container>
                    </div>
                </ng-container>
            </div>

            <div class="flex gap-2 mb-4">
                <button type="button" class="p-button p-component p-button-success" (click)="onSearch()">
                    <span class="p-button-icon pi pi-check"></span>
                    <span class="p-button-label">بحث</span>
                </button>
                <button type="button" class="p-button p-component p-button-secondary" (click)="onReset()">
                    <span class="p-button-icon pi pi-refresh"></span>
                    <span class="p-button-label">إعادة ضبط الكشف</span>
                </button>
            </div>

            <p-table [value]="[]" [paginator]="true" [rows]="20" [rowsPerPageOptions]="[20, 50, 100]" responsiveLayout="scroll" showGridlines="true" stripedRows="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th class="w-24">ت</th>
                        <th *ngFor="let col of (config?.columns ?? [])">{{ col }}</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="caption">
                    <div class="text-base font-medium">{{ config?.tableTitle }}</div>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td [attr.colspan]="(config?.columns?.length ?? 0) + 1" class="text-center">لا توجد بيانات</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class DiscoverReportPage {
    key = '';
    title = 'الكشوفات';
    config: DiscoverReportConfig | null = null;
    filterValues: Record<string, unknown> = {};

    private readonly destroyRef = inject(DestroyRef);

    constructor(route: ActivatedRoute) {
        route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.key = params.get('key') ?? '';
            this.config = DISCOVER_REPORT_CONFIGS.find((r) => r.key === this.key) ?? null;
            this.title = this.config?.title ?? 'الكشوفات';
            this.filterValues = {};
        });
    }

    toOptions(options?: ReadonlyArray<string | { label: string; value: string | number | boolean }>): Array<string | { label: string; value: string | number | boolean }> {
        return options ? [...options] : [];
    }

    onSearch(): void {
        // Placeholder for search behavior
    }

    onReset(): void {
        this.filterValues = {};
    }
}
