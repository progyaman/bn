import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-events-completing',
    standalone: true,
    imports: [CommonModule, DividerModule],
    template: `
        <div class="card" dir="rtl">
            <div class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2">استكمال</div>
            <div class="text-surface-600 dark:text-surface-300 text-sm">هذه الصفحة UI فقط وسيتم ربطها لاحقاً.</div>
            <p-divider />
        </div>
    `
})
export class EventsCompleting {}
