import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface Named {
    id: number;
    name: string;
}

interface ManagementUnit {
    id: number;
    path: string;
}

interface SecurityFile {
    id: number;
    name: string;
}

interface SourceOfficer {
    id: number;
    sourceSymbol: string;
}

interface SpreadingPlace {
    country?: Named;
    city?: Named;
    district?: Named;
    handDistrict?: Named;
    neighbourhood?: string;
}

interface Coordinate {
    coordinateTypeName: string;
}

interface UploadedFileRow {
    id: number;
    fileName: string;
    extension: string;
}

type Reliability = 'موثوق' | 'متوسط' | 'ضعيف' | 'غير موثوق';

interface AdditionArmsRow {
    id: number;

    addition_nickName: string;

    firstName: string;
    secondName: string;
    thirdName: string;
    fourthName: string;
    sureName: string;

    fullMotherName: string;
    motherSureName: string;

    phoneNumbers: string;

    name: string;
    typeArmsName: string;

    ccountryName: string;
    cityName: string;
    districtName: string;
    handDistrictName: string;
    addressNeighbourhood: string;

    symbolOrName: string;
    secondSymbol: string;

    addition_arm_muId: number;
    reliability: Reliability;

    securityFiles: SecurityFile[];
    sourceOfficer: SourceOfficer;

    spreadingPlaces: SpreadingPlace[];

    type: string;
    note: string;

    mu_id: number;
    nickName: string;

    coordinates: Coordinate[];

    uploadFiles: UploadedFileRow[];
    transfers: { id: number; mu_tr_id: number; nickName_tr: string; createDate: Date }[];

    createDate: Date;
}

interface ColumnDef {
    field: string;
    header: string;
    width?: string;
}

@Component({
    selector: 'app-addition-arms-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        ConfirmDialogModule,
        ToastModule,
        DividerModule,
        SelectModule,
        MultiSelectModule,
        BadgeModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card" dir="rtl">
            <p-toast />
            <p-confirmdialog />

            <div class="flex flex-col gap-2 mb-6">
                <div class="text-xl font-semibold text-surface-900 dark:text-surface-0">جدول اذرع الجمع</div>
                <div class="text-surface-600 dark:text-surface-300 text-sm">واجهة عرض مبنية على list.xhtml (UI فقط).</div>
            </div>

            <p-divider />

            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <div class="flex flex-wrap gap-2 items-center">
                        <p-multiselect
                            [options]="allColumns"
                            optionLabel="header"
                            [(ngModel)]="visibleColumns"
                            display="chip"
                            placeholder="الأعمدة"
                        />

                        <p-button
                            label="ترحيل"
                            icon="pi pi-plus"
                            severity="success"
                            [disabled]="selectedRows().length === 0"
                            (onClick)="openTransferMulti()"
                        />
                    </div>
                </ng-template>

                <ng-template #end>
                    <div class="flex flex-wrap gap-2 items-center justify-end">
                        <p-button label="بحث" severity="success" (onClick)="applyMuFilter()" />

                        <p-select
                            [options]="managementUnits"
                            optionLabel="path"
                            optionValue="id"
                            [(ngModel)]="muFilterId"
                            placeholder="البحث عن طريق الوحدة الادارية"
                            [filter]="true"
                            filterBy="path"
                            [showClear]="true"
                            styleClass="min-w-64"
                        />

                        <p-iconfield>
                            <p-inputicon styleClass="pi pi-search" />
                            <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="البحث ..." />
                        </p-iconfield>
                    </div>
                </ng-template>
            </p-toolbar>

            <p-table
                #dt
                [value]="rowsView()"
                [rows]="20"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                [showGridlines]="true"
                [(selection)]="selectedRowsModel"
                selectionMode="multiple"
                currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords}"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[20, 50, 100]"
                [globalFilterFields]="globalFilterFields"
                [tableStyle]="{ 'min-width': '110rem' }"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 3.5rem"><p-tableHeaderCheckbox /></th>
                        <th style="width: 16rem">تعديل / حـذف /المرفقات/ ترحيل</th>
                        <th style="width: 5rem">تسلسل</th>

                        <ng-container *ngFor="let col of visibleColumns">
                            <th [style.width]="col.width || null">{{ col.header }}</th>
                        </ng-container>
                    </tr>
                </ng-template>

                <ng-template #body let-row let-rowIndex="rowIndex">
                    <tr>
                        <td><p-tableCheckbox [value]="row" /></td>

                        <td>
                            <div class="flex gap-2 justify-end">
                                <p-button
                                    icon="pi pi-pencil"
                                    severity="secondary"
                                    [text]="true"
                                    [routerLink]="['/apps/additionArms/create']"
                                    [queryParams]="{ id: row.id }"
                                />
                                <p-button icon="pi pi-trash" severity="danger" [text]="true" (onClick)="confirmDelete(row)" />

                                <p-badge *ngIf="row.uploadFiles.length" [value]="row.uploadFiles.length" severity="secondary">
                                    <p-button icon="pi pi-eye" severity="secondary" [text]="true" (onClick)="openUpload(row)" />
                                </p-badge>
                                <p-button
                                    *ngIf="!row.uploadFiles.length"
                                    icon="pi pi-eye"
                                    severity="secondary"
                                    [text]="true"
                                    [disabled]="true"
                                />

                                <p-badge [value]="row.transfers.length" severity="danger">
                                    <p-button icon="pi pi-send" [text]="true" (onClick)="openTransfer(row)" />
                                </p-badge>
                            </div>
                        </td>

                        <td>{{ rowIndex + 1 }}</td>

                        <ng-container *ngFor="let col of visibleColumns">
                            <td>
                                <ng-container [ngSwitch]="col.field">
                                    <ng-container *ngSwitchCase="'reliability'">
                                        <span class="customer-badge" [ngClass]="reliabilityClass(row.reliability)">{{ row.reliability }}</span>
                                    </ng-container>

                                    <ng-container *ngSwitchCase="'securityFiles'">
                                        <div *ngFor="let sf of row.securityFiles">{{ sf.name }}</div>
                                    </ng-container>

                                    <ng-container *ngSwitchCase="'spreadingCountry'">
                                        <div *ngFor="let sp of row.spreadingPlaces">{{ sp.country?.name }}</div>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'spreadingCity'">
                                        <div *ngFor="let sp of row.spreadingPlaces">{{ sp.city?.name }}</div>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'spreadingDistrict'">
                                        <div *ngFor="let sp of row.spreadingPlaces">{{ sp.district?.name }}</div>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'spreadingHandDistrict'">
                                        <div *ngFor="let sp of row.spreadingPlaces">{{ sp.handDistrict?.name }}</div>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'spreadingNeighbourhood'">
                                        <div *ngFor="let sp of row.spreadingPlaces">{{ sp.neighbourhood }}</div>
                                    </ng-container>

                                    <ng-container *ngSwitchCase="'sourceOfficer'">
                                        {{ row.sourceOfficer.sourceSymbol }}
                                    </ng-container>

                                    <ng-container *ngSwitchCase="'muPath'">
                                        {{ muPath(row.mu_id) }}
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'dependencyMuPath'">
                                        {{ muPath(row.addition_arm_muId) }}
                                    </ng-container>

                                    <ng-container *ngSwitchCase="'cordinates'">
                                        {{ coordinatesString(row) }}
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'coordinateTypes'">
                                        <div *ngFor="let c of row.coordinates">{{ c.coordinateTypeName }}</div>
                                    </ng-container>

                                    <ng-container *ngSwitchCase="'createDate'">
                                        {{ formatDate(row.createDate) }}
                                    </ng-container>

                                    <ng-container *ngSwitchDefault>
                                        {{ valueByField(row, col.field) }}
                                    </ng-container>
                                </ng-container>
                            </td>
                        </ng-container>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td [attr.colspan]="3 + visibleColumns.length" class="text-center text-surface-600 dark:text-surface-300">
                            لا توجد اذرع مضافة
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <p-dialog [(visible)]="uploadDialog" [modal]="true" [draggable]="false" [resizable]="true" [style]="{ width: '70rem' }">
                <ng-template #header>
                    <div class="font-semibold">المرفقات</div>
                </ng-template>

                <div class="flex flex-col gap-4" dir="rtl">
                    <p-table [value]="selectedUploadRows" [showGridlines]="true" [tableStyle]="{ 'min-width': '40rem' }">
                        <ng-template #header>
                            <tr>
                                <th>اسم المرفق</th>
                                <th style="width: 10rem">الصيغة</th>
                                <th style="width: 8rem">عرض</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-u>
                            <tr>
                                <td>{{ u.fileName }}</td>
                                <td>{{ u.extension }}</td>
                                <td class="text-center">
                                    <p-button icon="pi pi-eye" severity="secondary" [text]="true" (onClick)="noop()" />
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="3" class="text-center text-surface-600 dark:text-surface-300">لا توجد مرفقات</td>
                            </tr>
                        </ng-template>
                    </p-table>

                    <div class="text-surface-600 dark:text-surface-300 text-sm">
                        معاينة المرفقات سيتم ربطها لاحقاً بعد ربط API.
                    </div>
                </div>
            </p-dialog>

            <p-dialog [(visible)]="transferDialog" [modal]="true" [draggable]="false" [resizable]="false" [style]="{ width: '60rem' }" header="الترحيل">
                <div class="flex flex-col gap-4" dir="rtl">
                    <div class="text-red-600 font-semibold">
                        من خلال الترحيل يمكنك مشاركة اذرع الجمع الخاص بك لوحدات ادارية اخرى
                    </div>

                    <div class="p-4 rounded-md border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                        <div class="font-semibold mb-3">اضافة ترحيل</div>

                        <div class="grid grid-cols-12 gap-3 items-center">
                            <div class="col-span-12 md:col-span-3 font-semibold">الوحدة الأدارية:</div>
                            <div class="col-span-12 md:col-span-7">
                                <p-select
                                    [options]="managementUnits"
                                    optionLabel="path"
                                    optionValue="id"
                                    [(ngModel)]="transferMuId"
                                    placeholder="يرجى الأختيار"
                                    [filter]="true"
                                    filterBy="path"
                                    [showClear]="true"
                                />
                            </div>
                            <div class="col-span-12 md:col-span-2 flex justify-end">
                                <p-button icon="pi pi-plus" (onClick)="addTransfer()" [disabled]="!transferMuId" />
                            </div>
                        </div>
                    </div>

                    <p-table [value]="transferList" [paginator]="true" [rows]="10" [showGridlines]="true" dataKey="id">
                        <ng-template #header>
                            <tr>
                                <th style="width: 6rem">حذف</th>
                                <th>الوحدة الإدارية</th>
                                <th style="width: 12rem">التحويل بواسطة</th>
                                <th style="width: 14rem">الوقت والتاريخ</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-tr>
                            <tr>
                                <td class="text-center">
                                    <p-button icon="pi pi-trash" severity="danger" [text]="true" (onClick)="confirmDeleteTransfer(tr)" />
                                </td>
                                <td>{{ muPath(tr.mu_tr_id) }}</td>
                                <td>{{ tr.nickName_tr }}</td>
                                <td>{{ formatDate(tr.createDate) }}</td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="4" class="text-center text-surface-600 dark:text-surface-300">لا توجد تحويلات</td>
                            </tr>
                        </ng-template>
                    </p-table>

                    <div class="flex justify-end">
                        <p-button label="الغاء" severity="secondary" (onClick)="closeTransfer()" />
                    </div>
                </div>
            </p-dialog>

            <p-dialog [(visible)]="transferMultiDialog" [modal]="true" [draggable]="false" [resizable]="false" [style]="{ width: '48rem' }" header="ترحيل المجموعة">
                <div class="flex flex-col gap-4" dir="rtl">
                    <div class="text-red-600 font-semibold">
                        من خلال الترحيل يمكنك مشاركة اذرع الجمع الخاص بك لوحدات ادارية اخرى
                    </div>

                    <div class="grid grid-cols-12 gap-3 items-center">
                        <div class="col-span-12 md:col-span-4 font-semibold">الوحدة الأدارية:</div>
                        <div class="col-span-12 md:col-span-6">
                            <p-select
                                [options]="managementUnits"
                                optionLabel="path"
                                optionValue="id"
                                [(ngModel)]="transferMuId"
                                placeholder="يرجى الأختيار"
                                [filter]="true"
                                filterBy="path"
                                [showClear]="true"
                            />
                        </div>
                        <div class="col-span-12 md:col-span-2 flex justify-end">
                            <p-button icon="pi pi-plus" (onClick)="addTransferMulti()" [disabled]="selectedRows().length === 0 || !transferMuId" />
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <p-button label="الغاء" severity="secondary" (onClick)="transferMultiDialog = false" />
                    </div>
                </div>
            </p-dialog>
        </div>
    `
})
export class AdditionArmsList {
    @ViewChild('dt') dt!: Table;

    managementUnits: ManagementUnit[] = [
        { id: 10, path: 'العراق / بغداد / الكرخ' },
        { id: 11, path: 'العراق / بغداد / الرصافة' },
        { id: 12, path: 'العراق / بابل / الحلة' }
    ];

    private readonly rowsAll = signal<AdditionArmsRow[]>([
        {
            id: 101,
            addition_nickName: 'الذراع-1',
            firstName: 'محمد',
            secondName: 'علي',
            thirdName: 'حسن',
            fourthName: 'جاسم',
            sureName: 'التميمي',
            fullMotherName: 'زينب أحمد عباس علي',
            motherSureName: 'التميمي',
            phoneNumbers: '0770xxxxxxx',
            name: 'ذراع جمع بشري',
            typeArmsName: 'مصدر بشري',
            ccountryName: 'العراق',
            cityName: 'بغداد',
            districtName: 'الكرخ',
            handDistrictName: 'المنصور',
            addressNeighbourhood: 'حي الجامعة',
            symbolOrName: 'A1',
            secondSymbol: 'A2',
            addition_arm_muId: 10,
            reliability: 'موثوق',
            securityFiles: [{ id: 1, name: 'ملف أمني 1' }],
            sourceOfficer: { id: 1, sourceSymbol: 'SO-11' },
            spreadingPlaces: [
                {
                    country: { id: 1, name: 'العراق' },
                    city: { id: 1, name: 'بغداد' },
                    district: { id: 1, name: 'الكرخ' },
                    handDistrict: { id: 1, name: 'المنصور' },
                    neighbourhood: 'الجامعة'
                }
            ],
            type: 'فعال',
            note: 'ملاحظة تجريبية',
            mu_id: 11,
            nickName: 'المستخدم1',
            coordinates: [{ coordinateTypeName: 'GPS' }],
            uploadFiles: [
                { id: 1, fileName: 'attach-1', extension: 'pdf' },
                { id: 2, fileName: 'attach-2', extension: 'jpg' }
            ],
            transfers: [{ id: 1, mu_tr_id: 12, nickName_tr: 'المستخدم2', createDate: new Date() }],
            createDate: new Date()
        },
        {
            id: 102,
            addition_nickName: 'الذراع-2',
            firstName: 'سارة',
            secondName: 'حسين',
            thirdName: 'محمود',
            fourthName: 'عبدالله',
            sureName: 'الشمري',
            fullMotherName: 'أمينة صالح محمد حسن',
            motherSureName: 'الشمري',
            phoneNumbers: '0780xxxxxxx',
            name: 'ذراع جمع فني',
            typeArmsName: 'فني',
            ccountryName: 'العراق',
            cityName: 'بابل',
            districtName: 'الحلة',
            handDistrictName: 'المحاويل',
            addressNeighbourhood: 'حي السلام',
            symbolOrName: 'B1',
            secondSymbol: 'B2',
            addition_arm_muId: 12,
            reliability: 'متوسط',
            securityFiles: [],
            sourceOfficer: { id: 2, sourceSymbol: 'SO-12' },
            spreadingPlaces: [],
            type: 'غير فعال',
            note: '',
            mu_id: 12,
            nickName: 'المستخدم3',
            coordinates: [],
            uploadFiles: [],
            transfers: [],
            createDate: new Date()
        }
    ]);

    rowsView = signal<AdditionArmsRow[]>(this.rowsAll());

    selectedRowsModel: AdditionArmsRow[] = [];
    selectedRows = signal<AdditionArmsRow[]>([]);

    muFilterId: number | null = null;

    allColumns: ColumnDef[] = [
        { field: 'addition_nickName', header: 'الكنية', width: '10rem' },
        { field: 'firstName', header: 'الأسم ألاول', width: '10rem' },
        { field: 'secondName', header: 'الأسم الأب', width: '10rem' },
        { field: 'thirdName', header: 'الأسم الجد', width: '10rem' },
        { field: 'fourthName', header: 'الأسم الرابع', width: '10rem' },
        { field: 'sureName', header: 'اللقب', width: '10rem' },
        { field: 'fullMotherName', header: 'اسم الام الرباعي', width: '14rem' },
        { field: 'motherSureName', header: 'لقب الام', width: '10rem' },
        { field: 'phoneNumbers', header: 'رقم الهاتف', width: '10rem' },
        { field: 'name', header: 'اسم الذراع', width: '10rem' },
        { field: 'typeArmsName', header: 'النوع', width: '10rem' },
        { field: 'ccountryName', header: 'عنوان السكن الدولة', width: '12rem' },
        { field: 'cityName', header: 'المحافظة', width: '12rem' },
        { field: 'districtName', header: 'القضاء', width: '12rem' },
        { field: 'handDistrictName', header: 'الناحية', width: '12rem' },
        { field: 'addressNeighbourhood', header: 'المنطقة', width: '12rem' },
        { field: 'symbolOrName', header: 'رمز مصدر الاول', width: '10rem' },
        { field: 'secondSymbol', header: 'رمز مصدر الثاني', width: '10rem' },
        { field: 'dependencyMuPath', header: 'العائدية', width: '16rem' },
        { field: 'reliability', header: 'الموثوقية', width: '10rem' },
        { field: 'securityFiles', header: 'الملف الأمني', width: '12rem' },
        { field: 'sourceOfficer', header: 'رمز ضابط المصدر', width: '12rem' },
        { field: 'spreadingCountry', header: 'الدولة', width: '10rem' },
        { field: 'spreadingCity', header: 'المحافظة', width: '10rem' },
        { field: 'spreadingDistrict', header: 'القضاء', width: '10rem' },
        { field: 'spreadingHandDistrict', header: 'الناحية', width: '10rem' },
        { field: 'spreadingNeighbourhood', header: 'المنطقة', width: '10rem' },
        { field: 'type', header: 'الحالة', width: '10rem' },
        { field: 'note', header: 'التفاصيل | الملاحظات', width: '18rem' },
        { field: 'muPath', header: 'الوحدة الأدارية', width: '16rem' },
        { field: 'nickName', header: 'الأضافة بواسطة', width: '10rem' },
        { field: 'cordinates', header: 'الأحداثي الجغرافي', width: '12rem' },
        { field: 'coordinateTypes', header: 'نوع الاحداثي الجغرافي', width: '12rem' },
        { field: 'createDate', header: 'وقت وتاريخ الأضافة', width: '12rem' }
    ];

    visibleColumns: ColumnDef[] = [
        this.allColumns[0],
        this.allColumns[1],
        this.allColumns[9],
        this.allColumns[10],
        this.allColumns[18],
        this.allColumns[19],
        this.allColumns[21],
        this.allColumns[27],
        this.allColumns[28],
        this.allColumns[29]
    ];

    globalFilterFields = [
        'addition_nickName',
        'firstName',
        'secondName',
        'thirdName',
        'fourthName',
        'sureName',
        'fullMotherName',
        'motherSureName',
        'phoneNumbers',
        'name',
        'typeArmsName',
        'ccountryName',
        'cityName',
        'districtName',
        'handDistrictName',
        'addressNeighbourhood',
        'symbolOrName',
        'secondSymbol',
        'reliability',
        'type',
        'note',
        'nickName'
    ];

    uploadDialog = false;
    selectedUploadRows: UploadedFileRow[] = [];

    transferDialog = false;
    transferMultiDialog = false;
    transferList: { id: number; mu_tr_id: number; nickName_tr: string; createDate: Date }[] = [];
    transferMuId: number | null = null;
    private transferTargetRow: AdditionArmsRow | null = null;

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    onGlobalFilter(table: Table, event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    applyMuFilter(): void {
        const muId = this.muFilterId;
        if (!muId) {
            this.rowsView.set(this.rowsAll());
            return;
        }

        this.rowsView.set(this.rowsAll().filter((r) => r.mu_id === muId || r.addition_arm_muId === muId));
    }

    confirmDelete(row: AdditionArmsRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.rowsAll.set(this.rowsAll().filter((r) => r.id !== row.id));
                this.applyMuFilter();
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف السجل' });
            }
        });
    }

    openUpload(row: AdditionArmsRow): void {
        this.selectedUploadRows = row.uploadFiles;
        this.uploadDialog = true;
    }

    openTransfer(row: AdditionArmsRow): void {
        this.transferTargetRow = row;
        this.transferList = [...row.transfers];
        this.transferMuId = null;
        this.transferDialog = true;
    }

    closeTransfer(): void {
        this.transferDialog = false;
        this.transferTargetRow = null;
        this.transferMuId = null;
        this.transferList = [];
    }

    openTransferMulti(): void {
        this.transferMuId = null;
        this.transferMultiDialog = true;
    }

    addTransfer(): void {
        if (!this.transferMuId || !this.transferTargetRow) return;

        const nextId = this.nextId(this.transferList);
        this.transferList = [
            ...this.transferList,
            { id: nextId, mu_tr_id: this.transferMuId, nickName_tr: 'المستخدم الحالي', createDate: new Date() }
        ];

        this.transferTargetRow.transfers = [...this.transferList];
        this.rowsAll.set(this.rowsAll().map((r) => (r.id === this.transferTargetRow!.id ? { ...this.transferTargetRow! } : r)));
        this.applyMuFilter();
    }

    addTransferMulti(): void {
        if (!this.transferMuId) return;

        const selected = this.selectedRows();
        if (!selected.length) return;

        const updated = this.rowsAll().map((r) => {
            const isSelected = selected.some((s) => s.id === r.id);
            if (!isSelected) return r;

            const nextId = this.nextId(r.transfers);
            return {
                ...r,
                transfers: [...r.transfers, { id: nextId, mu_tr_id: this.transferMuId!, nickName_tr: 'المستخدم الحالي', createDate: new Date() }]
            };
        });

        this.rowsAll.set(updated);
        this.applyMuFilter();
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم إضافة ترحيل للمجموعة' });
    }

    confirmDeleteTransfer(tr: { id: number }): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.transferList = this.transferList.filter((t) => t.id !== tr.id);
                if (this.transferTargetRow) {
                    this.transferTargetRow.transfers = [...this.transferList];
                    this.rowsAll.set(this.rowsAll().map((r) => (r.id === this.transferTargetRow!.id ? { ...this.transferTargetRow! } : r)));
                    this.applyMuFilter();
                }
            }
        });
    }

    muPath(muId: number): string {
        return this.managementUnits.find((m) => m.id === muId)?.path ?? '';
    }

    coordinatesString(row: AdditionArmsRow): string {
        if (!row.coordinates.length) return '';
        return 'مضاف';
    }

    formatDate(d: Date): string {
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        const hour = `${d.getHours()}`.padStart(2, '0');
        const minute = `${d.getMinutes()}`.padStart(2, '0');
        return `${year}/${month}/${day} ${hour}:${minute}`;
    }

    reliabilityClass(rel: Reliability): string {
        if (rel === 'موثوق') return 'status-qualified';
        if (rel === 'متوسط') return 'status-new';
        if (rel === 'ضعيف') return 'status-negotiation';
        return 'status-unqualified';
    }

    valueByField(row: AdditionArmsRow, field: string): unknown {
        return (row as unknown as Record<string, unknown>)[field];
    }

    noop(): void {}

    private nextId<T extends { id: number }>(items: T[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) maxId = item.id;
        }
        return maxId + 1;
    }
}
