import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';

type SelectOption = { label: string; value: string };

type FileRow = {
    name: string;
    provinces: string[];
    orgTypes: string[];
};

@Component({
    selector: 'files-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, SelectModule, DatePickerModule, ChartModule, MultiSelectModule],
    template: `
        <div class="flex flex-col gap-6" dir="rtl">
            <div class="flex items-center justify-between">
                <div class="font-semibold text-xl">إحصائيات الملفات</div>
                <p-button icon="pi pi-filter" severity="secondary" (onClick)="isFilterOpen.set(true)" />
            </div>

            <p-dialog header="نافذة البحث المتقدم" [visible]="isFilterOpen()" (visibleChange)="isFilterOpen.set($event)" [modal]="true" [style]="{ width: '32rem' }">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">الملف العسكري</label>
                        <p-select [(ngModel)]="filters.file" [options]="fileOptions" optionLabel="label" optionValue="value" class="w-full" [disabled]="true" />
                    </div>

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

            <div class="card flex flex-col gap-4">
                <div class="font-semibold">أنشطة التنظيمات حسب الملف الست</div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div class="md:col-span-3 flex flex-col gap-2">
                        <label class="font-semibold">الملف</label>
                        <p-select [(ngModel)]="selectedFile" [options]="fileOptions" optionLabel="label" optionValue="value" class="w-full" (ngModelChange)="onFileChange()" />
                    </div>

                    <div class="md:col-span-9 flex flex-col gap-2">
                        <div class="flex items-center gap-2 flex-wrap">
                            <div class="font-semibold">نوع التنظيم</div>
                            <p-button label="إظهار الكل" icon="pi pi-plus" severity="success" [outlined]="true"
                                      (onClick)="showAll()" [disabled]="selectedOrgTypes().length === currentFile().orgTypes.length" />
                            <p-button label="اخفاء الكل" icon="pi pi-times" severity="danger" [outlined]="true"
                                      (onClick)="hideAll()" [disabled]="selectedOrgTypes().length === 0" />
                        </div>

                        <p-multiselect [(ngModel)]="selectedOrgTypesModel" [options]="orgTypeOptions()" optionLabel="label" optionValue="value"
                                      display="chip" class="w-full" placeholder="اختر نوع التنظيم" (onChange)="onOrgTypeChange()" />
                    </div>
                </div>

                <div class="h-64">
                    <p-chart type="bar" [data]="barData()" [options]="barOptions"></p-chart>
                </div>

                <div class="flex flex-col gap-2">
                    <div class="font-semibold">تفاصيل حسب المحافظات</div>

                    <div class="overflow-auto">
                        <div class="min-w-[720px]">
                            <div class="grid grid-cols-12 font-semibold border-b border-surface-200 pb-2">
                                <div class="col-span-3">نوع التنظيم</div>
                                <div class="col-span-9 grid gap-2" [style.gridTemplateColumns]="'repeat(' + provinces().length + ', minmax(0, 1fr))'">
                                    <div class="text-center" *ngFor="let p of provinces()">{{ p }}</div>
                                </div>
                            </div>

                            <div class="grid grid-cols-12 py-2 border-b border-surface-100" *ngFor="let orgType of selectedOrgTypes()">
                                <div class="col-span-3 truncate">{{ orgType }}</div>
                                <div class="col-span-9 grid gap-2" [style.gridTemplateColumns]="'repeat(' + provinces().length + ', minmax(0, 1fr))'">
                                    <div class="text-center" *ngFor="let p of provinces()">{{ countFor(p, orgType) }}</div>
                                </div>
                            </div>

                            <div class="py-4 text-center text-surface-500" *ngIf="selectedOrgTypes().length === 0">
                                عذراً، لا توجد أنشطة لهذا الملف
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class FilesDashboard {
    isFilterOpen = signal(false);

    private readonly files: FileRow[] = [
        {
            name: 'ملف 1',
            provinces: ['بغداد', 'نينوى', 'الأنبار', 'البصرة', 'كركوك'],
            orgTypes: ['تنظيم A', 'تنظيم B', 'تنظيم C', 'تنظيم D', 'تنظيم E']
        },
        {
            name: 'ملف 2',
            provinces: ['بغداد', 'ديالى', 'صلاح الدين', 'كربلاء'],
            orgTypes: ['تنظيم A', 'تنظيم C', 'تنظيم F']
        },
        {
            name: 'ملف 3',
            provinces: ['أربيل', 'دهوك', 'السليمانية'],
            orgTypes: ['تنظيم B', 'تنظيم C', 'تنظيم D']
        }
    ];

    fileOptions: SelectOption[] = this.files.map((f) => ({ label: f.name, value: f.name }));

    missionOptions: SelectOption[] = [
        { label: 'يرجى الأختيار', value: '' },
        { label: 'مهمة 1', value: 'm1' },
        { label: 'مهمة 2', value: 'm2' }
    ];

    filters = {
        file: this.files[0]?.name ?? '',
        mission: '',
        dateRange: null as any
    };

    selectedFile = this.files[0]?.name ?? '';

    selectedOrgTypes = signal<string[]>([...this.files[0].orgTypes]);
    selectedOrgTypesModel: string[] = [...this.files[0].orgTypes];

    currentFile = computed(() => this.files.find((f) => f.name === this.selectedFile) ?? this.files[0]);

    provinces = computed(() => this.currentFile().provinces);

    orgTypeOptions = computed(() => this.currentFile().orgTypes.map((t) => ({ label: t, value: t })));

    barOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    barData = computed(() => {
        const labels = this.provinces();
        const orgTypes = this.selectedOrgTypes();

        return {
            labels,
            datasets: orgTypes.map((orgType) => ({
                label: orgType,
                data: labels.map((p) => this.countFor(p, orgType))
            }))
        };
    });

    onFileChange() {
        const next = this.currentFile();
        this.selectedOrgTypes.set([...next.orgTypes]);
        this.selectedOrgTypesModel = [...next.orgTypes];
    }

    onOrgTypeChange() {
        this.selectedOrgTypes.set([...this.selectedOrgTypesModel]);
    }

    showAll() {
        const all = this.currentFile().orgTypes;
        this.selectedOrgTypesModel = [...all];
        this.selectedOrgTypes.set([...all]);
    }

    hideAll() {
        this.selectedOrgTypesModel = [];
        this.selectedOrgTypes.set([]);
    }

    applyFilters() {
        this.isFilterOpen.set(false);
    }

    countFor(province: string, orgType: string): number {
        const fileName = this.currentFile().name;
        const key = `${fileName}|${province}|${orgType}`;
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
        }
        return 1 + (hash % 25);
    }
}
