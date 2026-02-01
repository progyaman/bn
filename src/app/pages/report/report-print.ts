import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

interface PrintableReport {
    id: number;
    date: Date | null;
    fromThem: string;
    toThem: string;
    theTopic: string;
    details: string;
}

@Component({
    selector: 'app-report-print',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, DividerModule],
    providers: [DatePipe],
    template: `
        <div dir="rtl" class="p-4">
            <div class="flex items-center justify-center mb-6 print:hidden">
                <p-button type="button" label="طباعة التقرير" icon="pi pi-print" (onClick)="print()" />
            </div>

            <div *ngIf="!report()" class="card mb-0">
                <div class="text-lg font-semibold">لا يوجد تقرير للطباعة</div>
                <div class="text-sm text-surface-600 dark:text-surface-300 mt-1">يرجى اختيار تقرير من قائمة التقارير ثم الضغط على طباعة.</div>
            </div>

            <div *ngIf="report()" class="card mb-0">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-4">
                        <div>جمهورية العراق</div>
                        <div>رئاسة الوزراء</div>
                        <div>الحشد الشعبي</div>
                        <div>قيادة عمليات صلاح الدين</div>
                        <div class="mt-2">الى : {{ report()?.toThem }}</div>
                        <div>من : {{ report()?.fromThem }}</div>
                    </div>
                    <div class="col-span-12 md:col-span-4 flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-sm font-semibold mb-2">بسم الله الرحمن الرحيم</div>
                            <img src="/images/app/bn.png" alt="logo" class="w-32 h-32 object-contain mx-auto" />
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-4 md:text-left">
                        <div>The Republic of Iraq</div>
                        <div>PRIME MINISTER</div>
                        <div>Poplur Mobilization Commission</div>
                        <div>Leadership Operations Salah Alddin</div>
                        <div>Department of inteligence</div>
                        <div class="mt-2">رقم الصادر : {{ report()?.id }}</div>
                        <div>التاريخ : {{ report()?.date ? (report()?.date | date : 'yyyy-MM-dd') : '-' }}</div>
                    </div>
                </div>

                <p-divider />

                <div class="text-lg"><b>الموضوع :</b> {{ report()?.theTopic }}</div>

                <p-divider />

                <div class="whitespace-pre-wrap"><b>التفاصيل :</b> {{ report()?.details }}</div>
            </div>
        </div>
    `
})
export class ReportPrintPage {
    private readonly route = inject(ActivatedRoute);

    private readonly reportId = computed(() => {
        const idParam = this.route.snapshot.queryParamMap.get('id');
        const id = idParam ? Number(idParam) : NaN;
        return Number.isFinite(id) ? id : null;
    });

    report = computed<PrintableReport | null>(() => {
        const id = this.reportId();
        if (!id) return null;

        return {
            id,
            date: new Date(),
            fromThem: 'قسم الاست',
            toThem: 'القيادة',
            theTopic: `موضوع التقرير رقم ${id}`,
            details: 'تفاصيل تجريبية...'
        };
    });

    print(): void {
        if (typeof window === 'undefined') return;
        window.print();
    }
}
