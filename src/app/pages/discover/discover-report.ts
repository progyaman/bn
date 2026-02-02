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
    templateUrl: './discover-report.html',
    styleUrl: './discover-report.scss'
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
