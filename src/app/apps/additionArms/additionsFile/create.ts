import { CommonModule } from '@angular/common';
import { Component, computed, signal, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'primeng/api';
import * as L from 'leaflet';

type ArmsKind = 'فني' | 'مصدر بشري';

type Reliability = 'غير موثوق' | 'ضعيف' | 'متوسط' | 'موثوق';

type ActiveState = 'فعال' | 'غير فعال';

interface Option {
    label: string;
    value: string;
}

interface SecurityFile {
    id: number;
    name: string;
}

interface SourceOfficer {
    id: number;
    sourceSymbol: string;
}

interface ManagementUnit {
    id: number;
    path: string;
}

interface UploadedFileRow {
    name: string;
    type?: string;
}

interface LocationRow {
    id: number;
    type: 'spreading' | 'residential';
    coords: string;
    path: string;
}

interface SpreadingPlaceRow {
    id: number;
    country?: string;
    city?: string;
    district?: string;
    handDistrict?: string;
    neighbourhood?: string;
}

interface Model {
    armsKind: ArmsKind | null;
    typeArms: string | null;

    dependencyMu: ManagementUnit | null;

    firstSymbol: string;
    reliability: Reliability | null;
    state: ActiveState | null;

    securityFiles: SecurityFile[];
    sourceOfficer: SourceOfficer | null;

    // human info
    nickName: string;
    firstName: string;
    secondName: string;
    thirdName: string;
    fourthName: string;
    sureName: string;
    fullMotherName: string;
    motherSureName: string;
    secondSymbol: string;
    phoneNumbers: string;

    note: string;
}

@Component({
    selector: 'app-addition-arms-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SelectModule,
        MultiSelectModule,
        InputTextModule,
        TextareaModule,
        AutoCompleteModule,
        ButtonModule,
        DividerModule,
        FileUploadModule,
        TableModule,
        DialogModule,
        TooltipModule,
        ColorPickerModule,
        SharedModule
    ],
    template: `
        <div class="page-container animate-fadein" dir="rtl">
            <!-- Header Section -->
            <div class="page-header mb-6 relative min-h-[50px]">
                <div class="flex items-center gap-3">
                    <i class="pi pi-plus-circle text-primary text-3xl"></i>
                    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0">اضافة ذراع جمع</h1>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6 pb-24">
                <!-- Main Form Area -->
                <div class="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <!-- Collection Info Card -->
                    <div class="card interactive-card shadow-sm border-none animate-slideup delay-100">
                        <div class="flex items-center gap-2 mb-6 border-b pb-4 border-sky-200 dark:border-sky-300">
                            <i class="pi pi-info-circle text-primary text-xl"></i>
                            <h2 class="text-xl font-semibold m-0">معلومات الجمع</h2>
                        </div>

                        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label mandatory">صنف الذراع</label>
                                <p-select
                                    class="w-full"
                                    [(ngModel)]="model().armsKind"
                                    [options]="armsKinds"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="يرجى الاختيار"
                                    [filter]="true"
                                    filterBy="label"
                                    (ngModelChange)="onArmsKindChanged()"
                                ></p-select>
                                <small class="text-red-500" *ngIf="submitted() && !model().armsKind">يرجى الإختيار</small>
                            </div>

                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label mandatory">النوع</label>
                                <div class="flex gap-2">
                                    <p-select
                                        class="w-full"
                                        [(ngModel)]="model().typeArms"
                                        [options]="typeArmsOptions()"
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="يرجى الاختيار"
                                        [filter]="true"
                                        filterBy="label"
                                    ></p-select>
                                    <p-button
                                        icon="pi pi-plus"
                                        severity="secondary"
                                        [outlined]="true"
                                        (onClick)="openTypeArmsDialog()"
                                        [disabled]="!model().armsKind"
                                        pTooltip="إضافة نوع"
                                    />
                                    <p-button
                                        icon="pi pi-trash"
                                        severity="danger"
                                        [outlined]="true"
                                        (onClick)="removeSelectedTypeArms()"
                                        [disabled]="!model().typeArms"
                                        pTooltip="حذف النوع"
                                    />
                                </div>
                                <small class="text-red-500" *ngIf="submitted() && !model().typeArms">يرجى اختيار النوع</small>
                            </div>

                            <div class="col-span-12 md:col-span-4 field-container" *ngIf="model().armsKind !== 'مصدر بشري'">
                                <label class="field-label">العائدية</label>
                                <p-autocomplete
                                    class="w-full"
                                    [(ngModel)]="model().dependencyMu"
                                    [suggestions]="muSuggestions()"
                                    (completeMethod)="searchMu($event)"
                                    [forceSelection]="true"
                                    [dropdown]="false"
                                    optionLabel="path"
                                    placeholder="بحث... يبدأ من 3 أحرف"
                                ></p-autocomplete>
                            </div>

                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label mandatory">رمز المصدر الاول</label>
                                <input pInputText class="w-full" [(ngModel)]="model().firstSymbol" maxlength="250" />
                                <small class="text-red-500" *ngIf="submitted() && !model().firstSymbol.trim()">يرجى ملئ رمز المصدر الأول</small>
                            </div>

                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label mandatory">الموثوقية</label>
                                <p-select
                                    class="w-full"
                                    [(ngModel)]="model().reliability"
                                    [options]="reliabilityOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="يرجى الاختيار"
                                ></p-select>
                                <small class="text-red-500" *ngIf="submitted() && !model().reliability">يرجى الإختيار الموثوقية</small>
                            </div>

                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label mandatory">الحالة</label>
                                <p-select
                                    class="w-full"
                                    [(ngModel)]="model().state"
                                    [options]="stateOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="يرجى الاختيار"
                                ></p-select>
                                <small class="text-red-500" *ngIf="submitted() && !model().state">يرجى الإختيار الحالة</small>
                            </div>

                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label">الملف العسكري</label>
                                <p-multiselect
                                    class="w-full"
                                    [options]="securityFiles"
                                    optionLabel="name"
                                    [(ngModel)]="model().securityFiles"
                                    [filter]="true"
                                    filterBy="name"
                                    placeholder="يرجى الاختيار"
                                    [disabled]="model().armsKind === 'فني'"
                                ></p-multiselect>
                            </div>

                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label mandatory">رمز ضابط المصدر</label>
                                <p-select
                                    class="w-full"
                                    [(ngModel)]="model().sourceOfficer"
                                    [options]="sourceOfficers"
                                    optionLabel="sourceSymbol"
                                    placeholder="يرجى الاختيار"
                                    [filter]="true"
                                    filterBy="sourceSymbol"
                                    [showClear]="true"
                                ></p-select>
                                <small class="text-red-500" *ngIf="submitted() && !model().sourceOfficer">يرجى اختيار رمز ضابط المصدر</small>
                            </div>
                        </div>
                    </div>

                    <!-- Human Info Card -->
                    <div class="card interactive-card shadow-sm border-none animate-slideup delay-200" *ngIf="model().armsKind !== 'فني'">
                        <div class="flex items-center gap-2 mb-6 border-b pb-4 border-sky-200 dark:border-sky-300">
                            <i class="pi pi-users text-primary text-xl"></i>
                            <h2 class="text-xl font-semibold m-0">معلومات المصدر البشري</h2>
                        </div>

                        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label">الكنية</label>
                                <input pInputText class="w-full" [(ngModel)]="model().nickName" maxlength="250" />
                            </div>
                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label">الأسم</label>
                                <input pInputText class="w-full" [(ngModel)]="model().firstName" maxlength="250" />
                            </div>
                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label">الأسم الأب</label>
                                <input pInputText class="w-full" [(ngModel)]="model().secondName" maxlength="250" />
                            </div>
                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label">الأسم الجد</label>
                                <input pInputText class="w-full" [(ngModel)]="model().thirdName" maxlength="250" />
                            </div>
                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label">الأسم الرابع</label>
                                <input pInputText class="w-full" [(ngModel)]="model().fourthName" maxlength="250" />
                            </div>
                            <div class="col-span-12 md:col-span-4 field-container">
                                <label class="field-label">اللقب</label>
                                <input pInputText class="w-full" [(ngModel)]="model().sureName" maxlength="250" />
                            </div>

                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label">اسم ألام الرباعي</label>
                                <input pInputText class="w-full" [(ngModel)]="model().fullMotherName" maxlength="250" />
                            </div>
                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label">لقب الأم</label>
                                <input pInputText class="w-full" [(ngModel)]="model().motherSureName" maxlength="250" />
                            </div>
                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label mandatory">رمز المصدر الثاني</label>
                                <input pInputText class="w-full" [(ngModel)]="model().secondSymbol" maxlength="250" />
                                <small class="text-red-500" *ngIf="submitted() && !model().secondSymbol.trim()">يرجى ملئ رمز المصدر الثاني</small>
                            </div>
                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label">رقم الهاتف</label>
                                <input
                                    pInputText
                                    class="w-full"
                                    [(ngModel)]="model().phoneNumbers"
                                    (input)="normalizePhone($event)"
                                    placeholder="أدخل رقم الهاتف"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Attachments Card -->
                    <div class="card interactive-card shadow-sm border-none animate-slideup delay-300">
                        <div class="flex items-center gap-2 mb-6 border-b pb-4 border-sky-200 dark:border-sky-300">
                            <i class="pi pi-paperclip text-primary text-xl"></i>
                            <h2 class="text-xl font-semibold m-0">المرفقات</h2>
                        </div>

                        <div class="flex flex-col gap-4">
                            <p-table [value]="uploads()" [rows]="10" [paginator]="true" styleClass="p-datatable-sm custom-table-modern">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th class="text-center" style="width: 80px">الإجراءات</th>
                                        <th>اسم الملف</th>
                                        <th style="width: 14rem">صيغة المرفق</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-row>
                                    <tr class="hover:bg-blue-50/50 transition-colors">
                                        <td class="text-center">
                                            <p-button icon="pi pi-trash" severity="danger" [text]="true" [rounded]="true" (onClick)="removeUpload(row)" pTooltip="حذف" />
                                        </td>
                                        <td class="font-bold text-surface-900 dark:text-surface-0">{{ row.name }}</td>
                                        <td class="text-surface-500">{{ row.type || '-' }}</td>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="emptymessage">
                                    <tr>
                                        <td colspan="3">
                                            <div class="flex flex-col items-center justify-center p-5 text-surface-400">
                                                <i class="pi pi-images text-4xl mb-3 opacity-20"></i>
                                                <p class="m-0 text-xs">لا توجد مرفقات حالياً.</p>
                                            </div>
                                        </td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <!-- Geolocation Card -->
                    <div class="card interactive-card shadow-sm border-none overflow-hidden p-0 animate-slideup delay-300">
                        <div class="p-4 border-b border-sky-200 dark:border-sky-300 bg-white dark:bg-surface-900">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-map text-primary text-xl"></i>
                                    <h2 class="text-xl font-semibold m-0">تحديد الموقع الجغرافي</h2>
                                </div>
                                <p-button 
                                    [label]="showMap ? 'إخفاء الخارطة' : 'تحديد على الخارطة'" 
                                    [icon]="showMap ? 'pi pi-eye-slash' : 'pi pi-map'" 
                                    [outlined]="true" 
                                    size="small"
                                    (onClick)="toggleMap()"
                                />
                            </div>
                        </div>

                        <div class="p-3 flex flex-col gap-4">
                            <!-- Location Mode Selector -->
                            <div class="flex p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
                                <button 
                                    type="button"
                                    class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 font-bold text-sm"
                                    [class]="locationMode() === 'spreading' ? 'bg-primary text-white shadow-md' : 'text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700'"
                                    (click)="locationMode.set('spreading')"
                                >
                                    <i class="pi pi-share-alt"></i>
                                    منطقة الأنتشار
                                </button>
                                <button 
                                    type="button"
                                    class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 font-bold text-sm"
                                    [class]="locationMode() === 'residential' ? 'bg-orange-500 text-white shadow-md' : 'text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700'"
                                    (click)="locationMode.set('residential')"
                                >
                                    <i class="pi pi-home"></i>
                                    عنوان السكن
                                </button>
                            </div>

                            <!-- Spreading Display -->
                            <div class="flex flex-col gap-2 p-3 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-800" [class.opacity-50]="locationMode() !== 'spreading'">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs font-bold text-primary">إحداثيات الانتشار</span>
                                    <span class="text-[10px] text-primary-400 tabular-nums">{{ mapCoordinates()[0] || '--.---' }}, {{ mapCoordinates()[1] || '--.---' }}</span>
                                </div>
                                <div class="flex items-start gap-2">
                                    <i class="pi pi-map-marker text-primary mt-0.5"></i>
                                    <span class="text-sm font-medium leading-tight text-surface-700 dark:text-surface-300">
                                        {{ spreadingPath() || 'لم يتم تحديد موقع على الخارطة بعد...' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Residential Display -->
                            <div class="flex flex-col gap-2 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800" [class.opacity-50]="locationMode() !== 'residential'">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs font-bold text-orange-600">إحداثيات السكن</span>
                                    <span class="text-[10px] text-orange-400 tabular-nums">{{ residentialCoords()[0] || '--.---' }}, {{ residentialCoords()[1] || '--.---' }}</span>
                                </div>
                                <div class="flex items-start gap-2">
                                    <i class="pi pi-compass text-orange-500 mt-0.5"></i>
                                    <span class="text-sm font-medium leading-tight text-surface-700 dark:text-surface-300">
                                        {{ residentialPath() || 'لم يتم تحديد موقع على الخارطة بعد...' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="map-wrapper" [class.expanded]="showMap">
                             <div #mapContainer class="map-container"></div>
                             <div class="map-overlay" *ngIf="showMap">
                                <p-button label="إعادة تعيين" icon="pi pi-refresh" [text]="true" size="small" severity="secondary" (onClick)="resetMap()" />
                             </div>
                        </div>

                        <!-- Locations Table -->
                        <div class="p-3 border-t border-sky-200 dark:border-sky-300 bg-surface-50/50" *ngIf="locationRows().length > 0">
                            <h3 class="text-sm font-bold mb-3 flex items-center gap-2 text-surface-700">
                                <i class="pi pi-list text-primary"></i>
                                المواقع المحددة
                            </h3>
                            <p-table [value]="locationRows()" styleClass="p-datatable-sm custom-locations-table">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th style="width: 3rem"></th>
                                        <th>النوع</th>
                                        <th>المسار</th>
                                        <th class="text-center">الإحداثيات</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-row>
                                    <tr>
                                        <td>
                                            <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="removeLocationRow(row)" />
                                        </td>
                                        <td>
                                            <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase" 
                                                [class]="row.type === 'spreading' ? 'bg-primary/10 text-primary' : 'bg-orange-100 text-orange-600'">
                                                {{ row.type === 'spreading' ? 'انتشار' : 'سكن' }}
                                            </span>
                                        </td>
                                        <td class="text-xs truncate max-w-[150px]" [pTooltip]="row.path">{{ row.path }}</td>
                                        <td class="text-[10px] tabular-nums text-center text-surface-400">{{ row.coords }}</td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </div>
                    </div>

                    <!-- Notes Card -->
                    <div class="card interactive-card shadow-sm border-none animate-slideup delay-300">
                        <div class="flex items-center gap-2 mb-6 border-b pb-4 border-sky-200 dark:border-sky-300">
                            <i class="pi pi-file-edit text-primary text-xl"></i>
                            <h2 class="text-xl font-semibold m-0">التفاصيل والملاحظات</h2>
                        </div>
                        <div class="field-container">
                            <label class="field-label">الملاحظات</label>
                            <textarea pTextarea class="w-full resize-none" [(ngModel)]="model().note" rows="8" placeholder="اكتب التفاصيل والملاحظات هنا..."></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Action Bar -->
            <div class="bottom-action-bar flex items-center justify-center p-4">
                <div class="action-container flex flex-wrap items-center justify-between gap-4 max-w-7xl w-full">
                    <div class="flex items-center gap-3">
                        <p-button label="حفظ ذراع الجمع" icon="pi pi-check-circle" severity="success" class="action-btn-primary" (onClick)="onSave()" />
                        <p-button label="حفظ كمسودة" icon="pi pi-save" [text]="true" severity="secondary" (onClick)="onSaveDraft()" class="hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" />
                        
                        <span class="h-8 w-px bg-sky-200 dark:bg-sky-300 mx-2 hidden md:block"></span>
                        
                        <div class="flex items-center gap-1">
                            <p-fileupload
                                mode="basic"
                                chooseLabel="رفع مرفق"
                                chooseIcon="pi pi-upload"
                                [multiple]="true"
                                [auto]="true"
                                (onSelect)="onFilesSelected($event)"
                                styleClass="p-button-text p-button-secondary"
                            ></p-fileupload>
                        </div>

                        <span class="h-8 w-px bg-sky-200 dark:bg-sky-300 mx-2 hidden md:block"></span>
                        
                        <p-button label="جدول اذرع الجمع" icon="pi pi-table" [outlined]="true" severity="danger" routerLink="/apps/additionArms/list" />
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <div class="hidden sm:flex flex-col items-end">
                            <span class="text-xs text-surface-500 uppercase tracking-wider font-bold">اكتمال النموذج</span>
                            <div class="flex items-center gap-3">
                                <div class="h-2.5 w-40 bg-sky-200 dark:bg-sky-300 rounded-full overflow-hidden progress-glow">
                                    <div class="h-full bg-primary transition-all duration-1000 ease-in-out relative" [style.width]="calcProgress() + '%'">
                                        <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                                <span class="text-base font-bold text-primary tabular-nums">{{ calcProgress() }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dialog: Add Type Arms -->
            <p-dialog [(visible)]="typeArmsDialog" [modal]="true" [draggable]="false" [resizable]="false" header="اضافة نوع الذراع" [style]="{ width: '34rem' }">
                <div class="flex flex-col gap-4" dir="rtl">
                    <div class="field-container">
                        <label class="field-label mandatory">اسم النوع</label>
                        <input pInputText class="w-full" [(ngModel)]="typeArmsDraftName" maxlength="255" />
                        <small class="text-red-500" *ngIf="typeArmsSubmitted && !typeArmsDraftName.trim()">يرجى ملئ حقل اسم النوع</small>
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                        <p-button label="الغاء" severity="secondary" [outlined]="true" (onClick)="closeTypeArmsDialog()" />
                        <p-button label="حفظ" icon="pi pi-check" (onClick)="saveTypeArms()" />
                    </div>
                </div>
            </p-dialog>
        </div>
    `,
    styles: [`
        .page-container {
            padding: 2rem;
            background: var(--surface-background);
        }

        .mandatory::after {
            content: " *";
            color: #ef4444;
            font-weight: bold;
        }

        .field-label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--surface-700);
            font-size: 0.95rem;
        }

        .page-header {
            padding-bottom: 0.5rem;
            display: inline-block;
            width: 100%;
        }

        :host ::ng-deep {
            .p-card {
                border-radius: 12px;
            }
            .p-inputtext:focus, .p-select:focus, .p-autocomplete-input:focus {
                border-color: var(--primary-color) !important;
                box-shadow: 0 0 0 0.2rem var(--primary-100) !important;
            }
            .custom-table-modern {
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            }
            .custom-table-modern .p-datatable-thead > tr > th {
                background: #f8fafc;
                color: #1e293b;
                font-weight: 600;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.025em;
                padding: 1rem;
                border-bottom: 2px solid #e2e8f0;
                border-inline-end: 1px solid #e2e8f0;
            }
            .custom-table-modern .p-datatable-tbody > tr > td {
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;
                border-inline-end: 1px solid #e2e8f0;
            }
            .custom-table-modern .p-datatable-tbody > tr:last-child > td {
                border-bottom: none;
            }
            .p-button-text {
                font-weight: 600;
            }
            .p-select, .p-datepicker, .p-autocomplete, .p-multiselect, .p-inputnumber {
                width: 100%;
            }

            .custom-locations-table {
                .p-datatable-thead > tr > th {
                    background: transparent;
                    font-size: 10px;
                    padding: 0.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .p-datatable-tbody > tr > td {
                    padding: 0.5rem;
                    border-bottom: 1px solid #f1f5f9;
                }
            }
        }

        .map-wrapper {
            height: 0;
            overflow: hidden;
            transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .map-wrapper.expanded {
            height: 350px;
            border-top: 1px solid var(--surface-200);
        }

        .map-container {
            height: 100%;
            width: 100%;
        }

        .map-overlay {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            padding: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .bottom-action-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            border-top: 1px solid #05375225;
            z-index: 1100;
            box-shadow: 0 -10px 25px -5px rgba(0,0,0,0.05);
        }

        .action-container {
            margin: 0 auto;
        }

        .action-btn-primary ::ng-deep .p-button {
            padding: 0.75rem 2rem;
            font-size: 1.1rem;
            border-radius: 10px;
        }

        .animate-fadein {
            animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideup {
            animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .interactive-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid transparent;
        }

        .interactive-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(24, 116, 221, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
            border-color: var(--primary-100);
        }

        .field-container {
            transition: all 0.2s ease;
            padding: 0.5rem;
            border-radius: 8px;
        }

        .field-container:focus-within {
            background: var(--surface-50);
        }

        .action-btn-primary ::ng-deep .p-button {
            padding: 0.75rem 2rem;
            font-size: 1.1rem;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .action-btn-primary ::ng-deep .p-button:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px var(--primary-200);
        }
    `]
})
export class AdditionArmsCreate implements AfterViewInit {
    @ViewChild('mapContainer') mapElement!: ElementRef;
    
    constructor(private cd: ChangeDetectorRef) {}

    map!: L.Map;
    spreadingMarker?: L.Marker;
    residentialMarker?: L.Marker;

    showMap = true;
    locationMode = signal<'spreading' | 'residential'>('spreading');
    mapCoordinates = signal<string[]>([]); // for spreading
    residentialCoords = signal<string[]>([]);
    spreadingPath = signal<string>('');
    residentialPath = signal<string>('');
    locationRows = signal<LocationRow[]>([]);

    submitted = signal(false);

    typeArmsDialog = false;
    typeArmsDraftName = '';
    typeArmsSubmitted = false;

    armsKinds: Option[] = [
        { label: 'فني', value: 'فني' },
        { label: 'مصدر بشري', value: 'مصدر بشري' }
    ];

    private typeArmsByKind = signal<Record<string, Option[]>>({
        فني: [
            { label: 'نوع فني 1', value: 'نوع فني 1' },
            { label: 'نوع فني 2', value: 'نوع فني 2' }
        ],
        'مصدر بشري': [
            { label: 'نوع بشري 1', value: 'نوع بشري 1' },
            { label: 'نوع بشري 2', value: 'نوع بشري 2' }
        ]
    });

    typeArmsOptions = computed<Option[]>(() => {
        const kind = this.model().armsKind;
        if (!kind) return [];
        return this.typeArmsByKind()[kind] ?? [];
    });

    reliabilityOptions: Option[] = [
        { label: 'غير موثوق', value: 'غير موثوق' },
        { label: 'ضعيف', value: 'ضعيف' },
        { label: 'متوسط', value: 'متوسط' },
        { label: 'موثوق', value: 'موثوق' }
    ];

    stateOptions: Option[] = [
        { label: 'فعال', value: 'فعال' },
        { label: 'غير فعال', value: 'غير فعال' }
    ];

    securityFiles: SecurityFile[] = [
        { id: 1, name: 'الملف العسكري 1' },
        { id: 2, name: 'الملف العسكري 2' },
        { id: 3, name: 'الملف العسكري 3' }
    ];

    sourceOfficers: SourceOfficer[] = [
        { id: 1, sourceSymbol: 'SO-001' },
        { id: 2, sourceSymbol: 'SO-002' }
    ];

    private managementUnits: ManagementUnit[] = [
        { id: 1, path: 'العراق / بغداد / الكرخ' },
        { id: 2, path: 'العراق / بغداد / الرصافة' },
        { id: 3, path: 'العراق / الانبار / الرمادي' },
        { id: 4, path: 'العراق / نينوى / الموصل' }
    ];

    muSuggestions = signal<ManagementUnit[]>([]);

    ngAfterViewInit() {
        if (this.showMap) {
            setTimeout(() => this.initMap(), 500);
        }
    }

    toggleMap() {
        this.showMap = !this.showMap;
        if (this.showMap) {
            setTimeout(() => {
                if (!this.map) {
                    this.initMap();
                } else {
                    this.map.invalidateSize();
                }
            }, 450);
        }
    }

    private initMap() {
        const iconDefault = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;

        const defaultCenter: L.LatLngExpression = [33.3152, 44.3661];

        this.map = L.map(this.mapElement.nativeElement, {
            center: defaultCenter,
            zoom: 6
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            this.setMarker(e.latlng);
        });

        if (this.mapCoordinates().length === 2) {
            const lat = parseFloat(this.mapCoordinates()[0]);
            const lng = parseFloat(this.mapCoordinates()[1]);
            this.setMarker(L.latLng(lat, lng));
        }
    }

    private setMarker(latlng: L.LatLng) {
        const mode = this.locationMode();
        
        if (mode === 'spreading') {
            if (this.spreadingMarker) {
                this.spreadingMarker.setLatLng(latlng);
            } else {
                this.spreadingMarker = L.marker(latlng, { draggable: true }).addTo(this.map);
                this.spreadingMarker.on('dragend', () => {
                   this.onMarkerUpdate('spreading', this.spreadingMarker!.getLatLng());
                });
            }
            this.onMarkerUpdate('spreading', latlng);
        } else {
            const iconOrange = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });
            if (this.residentialMarker) {
                this.residentialMarker.setLatLng(latlng);
            } else {
                this.residentialMarker = L.marker(latlng, { draggable: true, icon: iconOrange }).addTo(this.map);
                this.residentialMarker.on('dragend', () => {
                   this.onMarkerUpdate('residential', this.residentialMarker!.getLatLng());
                });
            }
            this.onMarkerUpdate('residential', latlng);
        }
    }

    private onMarkerUpdate(mode: 'spreading' | 'residential', latlng: L.LatLng) {
        const coords = [latlng.lat.toFixed(6), latlng.lng.toFixed(6)];
        if (mode === 'spreading') {
            this.mapCoordinates.set(coords);
            this.reverseGeocode(latlng.lat, latlng.lng, 'spreading');
        } else {
            this.residentialCoords.set(coords);
            this.reverseGeocode(latlng.lat, latlng.lng, 'residential');
        }
    }

    private async reverseGeocode(lat: number, lng: number, mode: 'spreading' | 'residential') {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`);
            const data = await response.json();
            if (data && data.display_name) {
                const parts = data.display_name.split(',').map((p: string) => p.trim());
                const path = parts.slice(0, 4).reverse().join(', ');
                
                const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                
                // Add to table
                this.locationRows.update(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        type: mode,
                        coords: coords,
                        path: path
                    }
                ]);

                if (mode === 'spreading') {
                    this.spreadingPath.set(path);
                } else {
                    this.residentialPath.set(path);
                }
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    }

    resetMap() {
        if (this.spreadingMarker) {
            this.map.removeLayer(this.spreadingMarker);
            this.spreadingMarker = undefined;
            this.mapCoordinates.set([]);
            this.spreadingPath.set('');
        }
        if (this.residentialMarker) {
            this.map.removeLayer(this.residentialMarker);
            this.residentialMarker = undefined;
            this.residentialCoords.set([]);
            this.residentialPath.set('');
        }
        this.locationRows.set([]);
        this.map.setView([33.3152, 44.3661], 6);
    }

    removeLocationRow(row: LocationRow) {
        this.locationRows.update(prev => prev.filter(r => r.id !== row.id));
    }

    // uploads
    uploads = signal<UploadedFileRow[]>([]);

    model = signal<Model>({
        armsKind: null,
        typeArms: null,
        dependencyMu: null,
        firstSymbol: '',
        reliability: null,
        state: null,
        securityFiles: [],
        sourceOfficer: null,
        nickName: '',
        firstName: '',
        secondName: '',
        thirdName: '',
        fourthName: '',
        sureName: '',
        fullMotherName: '',
        motherSureName: '',
        secondSymbol: '',
        phoneNumbers: '',
        note: ''
    });

    onSave(): void {
        this.submitted.set(true);

        const m = this.model();
        const data = {
            ...m,
            spreadingCoords: this.mapCoordinates(),
            spreadingPath: this.spreadingPath(),
            residentialCoords: this.residentialCoords(),
            residentialPath: this.residentialPath(),
            locationHistory: this.locationRows(),
            attachments: this.uploads()
        };

        if (!m.armsKind) return;
        if (!m.typeArms) return;
        if (!m.firstSymbol.trim()) return;
        if (!m.secondSymbol.trim()) return;
        if (!m.reliability) return;
        if (!m.state) return;
        if (!m.sourceOfficer) return;

        // UI-first: no API call yet.
        console.log('Save Addition Arms:', data);
    }

    onSaveDraft(): void {
        const data = {
            ...this.model(),
            spreadingCoords: this.mapCoordinates(),
            spreadingPath: this.spreadingPath(),
            residentialCoords: this.residentialCoords(),
            residentialPath: this.residentialPath(),
            locationHistory: this.locationRows(),
            attachments: this.uploads()
        };
        console.log('Saved as draft:', data);
    }

    onArmsKindChanged(): void {
        this.model.update((m) => ({
            ...m,
            typeArms: null,
            dependencyMu: null,
            securityFiles: m.armsKind === 'فني' ? [] : m.securityFiles
        }));
    }

    openTypeArmsDialog(): void {
        this.typeArmsDraftName = '';
        this.typeArmsSubmitted = false;
        this.typeArmsDialog = true;
    }

    removeSelectedTypeArms(): void {
        const kind = this.model().armsKind;
        const selected = this.model().typeArms;
        if (!kind || !selected) return;

        this.typeArmsByKind.update((map) => {
            const current = map[kind] ?? [];
            return {
                ...map,
                [kind]: current.filter((o) => o.value !== selected)
            };
        });

        this.model.update((m) => ({ ...m, typeArms: null }));
    }

    closeTypeArmsDialog(): void {
        this.typeArmsDialog = false;
        this.typeArmsSubmitted = false;
    }

    saveTypeArms(): void {
        this.typeArmsSubmitted = true;
        const name = (this.typeArmsDraftName || '').trim();
        const kind = this.model().armsKind;
        if (!name || !kind) return;

        this.typeArmsByKind.update((map) => {
            const current = map[kind] ?? [];
            if (current.some((o) => o.value === name)) return map;
            return {
                ...map,
                [kind]: [...current, { label: name, value: name }]
            };
        });

        this.model.update((m) => ({ ...m, typeArms: name }));
        this.typeArmsDialog = false;
    }

    searchMu(event: AutoCompleteCompleteEvent): void {
        const query = (event.query || '').trim();
        if (query.length < 3) {
            this.muSuggestions.set([]);
            return;
        }

        const lowered = query.toLowerCase();
        this.muSuggestions.set(this.managementUnits.filter((m) => m.path.toLowerCase().includes(lowered)).slice(0, 20));
    }

    normalizePhone(event: Event): void {
        const input = event.target as HTMLInputElement | null;
        if (!input) return;
        input.value = input.value.replace(/[^0-9+\-\s]/g, '');
        this.model.update((m) => ({ ...m, phoneNumbers: input.value }));
    }

    onFilesSelected(event: any): void {
        const files = event.files || event.currentFiles || [];
        if (files && files.length > 0) {
            const newRows: UploadedFileRow[] = Array.from(files).map((f: any) => ({
                name: f.name,
                type: f.type
            }));
            this.uploads.update(current => [...current, ...newRows]);
            this.cd.detectChanges();
        }
    }

    removeUpload(row: UploadedFileRow): void {
        this.uploads.update(list => list.filter((it) => it !== row));
    }

    private nextId<T extends { id: number }>(items: T[]): number {
        let maxId = 0;
        for (const item of items) {
            if (item.id > maxId) maxId = item.id;
        }
        return maxId + 1;
    }

    calcProgress(): number {
        const m = this.model();
        const fields = [
            m.armsKind,
            m.typeArms,
            m.firstSymbol,
            m.reliability,
            m.state,
            m.sourceOfficer,
            m.firstName,
            m.secondName,
            m.thirdName
        ];

        if (m.armsKind === 'مصدر بشري') {
            fields.push(m.secondSymbol);
        }

        const filled = fields.filter((f) => {
            if (typeof f === 'string') return f.trim().length > 0;
            return !!f;
        }).length;

        // Add map and paths
        const hasSpreading = this.mapCoordinates().length === 2 && this.spreadingPath().length > 0;
        const hasResidential = this.residentialCoords().length === 2 && this.residentialPath().length > 0;
        
        const totalFields = fields.length + 2;
        const totalFilled = filled + (hasSpreading ? 1 : 0) + (hasResidential ? 1 : 0);

        return Math.round((totalFilled / totalFields) * 100);
    }
}
