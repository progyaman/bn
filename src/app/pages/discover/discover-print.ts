import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DISCOVER_REPORT_CONFIGS, DiscoverReportConfig } from './discover.data';

@Component({
    selector: 'app-discover-print',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    templateUrl: './discover-print.html',
    styleUrl: './discover-print.scss'
})
export class DiscoverPrintPage {
    key = '';
    title = 'الكشوفات';
    config: DiscoverReportConfig | null = null;
    headerColumns: string[] = [];
    extraMatrixColumns: string[] = [];
    localDate = '';
    localDateTime = '';

    constructor(route: ActivatedRoute) {
        this.key = route.snapshot.paramMap.get('key') ?? '';
        this.config = DISCOVER_REPORT_CONFIGS.find((r) => r.key === this.key) ?? null;
        this.title = this.config?.title ?? 'الكشوفات';
        this.headerColumns = [...(this.config?.columns ?? [])];
        if (this.config?.printLayout === 'matrix') {
            this.headerColumns = [this.headerColumns[0] ?? 'البند', ...this.headerColumns.slice(1), 'المجموع'];
            this.extraMatrixColumns = this.headerColumns.slice(1);
        }
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.localDate = `${date.getFullYear()}/${month}/${day}`;
        const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        this.localDateTime = `${time} - ${this.localDate}`;
    }

    onPrint(): void {
        window.print();
    }
}
