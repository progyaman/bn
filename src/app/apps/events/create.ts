import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { EventTypeSidebarComponent } from './event-type-sidebar.component';
import * as L from 'leaflet';

interface CreateEventModel {
    typeThreat?: string;
    activityType?: string;
    date?: Date | null;
    time?: Date | null;
    durationHours?: number | null;
    otherHands?: string[];
    missionName?: string;
    organization?: string;
    typeOrgNames?: string[];
    tab3yeaAlMonjaz?: string;
    requestMu?: string;
    targetEntity?: string;
    destinationKm?: number | null;
    theNews?: string;
    targets?: string[];
    sourceMu?: string;
    numberBook?: string;
    nameAdditionArms?: string;
    typeArms?: string;
    additionArms?: string;
    holdingForces?: string[];
    coordinates: string[];
}

interface AttachmentRow {
    name: string;
    mimeType?: string;
    file?: File;
    objectUrl?: string;
}

@Component({
    selector: 'app-create-event',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        DatePickerModule,
        FileUploadModule,
        AutoCompleteModule,
        MultiSelectModule,
        InputNumberModule,
        TableModule,
        TooltipModule,
        EventTypeSidebarComponent
    ],
    template: `
        <div class="page-container animate-fadein" dir="rtl">
            <app-event-type-sidebar #typeSidebar (actionClicked)="handleEventTypeAction($event)" class="hidden" />
            
            <!-- Custom Mega Topbar Trigger -->
            <div class="mega-topbar mb-6 p-4 bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 flex items-center justify-between relative z-[1000]">
                <div class="flex items-center gap-6">
                    <!-- Mega Menu Trigger -->
                    <div class="relative flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-300 select-none"
                         (click)="toggleMegaMenu()" (mouseenter)="openMegaMenu()" (mouseleave)="closeMegaMenu()">
                        
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <i class="pi pi-plus-circle text-primary text-xl"></i>
                            </div>
                            <span class="text-xl font-bold bg-gradient-to-l from-primary to-primary-600 bg-clip-text text-transparent">إضافة حدث</span>
                            <i class="pi pi-chevron-down text-xs transition-transform duration-300" [class.rotate-180]="isMegaMenuOpen"></i>
                        </div>

                        <!-- Mega Menu Dropdown -->
                        <div class="mega-menu-dropdown absolute top-full right-0 mt-4 shadow-2xl transition-all duration-300 origin-top-right transform z-[1100]"
                             [class.visible]="isMegaMenuOpen" [class.opacity-100]="isMegaMenuOpen" [class.scale-100]="isMegaMenuOpen"
                             [class.invisible]="!isMegaMenuOpen" [class.opacity-0]="!isMegaMenuOpen" [class.scale-95]="!isMegaMenuOpen"
                             (mouseenter)="openMegaMenu()" (mouseleave)="closeMegaMenu()">
                            
                             <div class="mega-menu-content p-6 bg-[#f6f7fb] dark:bg-surface-950 rounded-[32px] border border-white/50 shadow-2xl w-[900px]">
                                <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
                                    
                                    <!-- Big Card (Spans 2 rows) -->
                                    <div class="mega-card bg-[#ffc107] hover:bg-[#ffb300] p-8 rounded-[28px] lg:row-span-2 flex flex-col justify-between group/card cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-yellow-500/10"
                                         (click)="selectEventType(eventTypes[0])">
                                        <div class="flex flex-col gap-4">
                                            <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                                                <i class="pi pi-shield text-[#ffc107] text-3xl"></i>
                                            </div>
                                            <div>
                                                <h3 class="text-2xl font-black text-surface-900 mb-2">{{ eventTypes[0].label }}</h3>
                                                <p class="text-surface-800 leading-relaxed text-sm opacity-80">{{ eventTypes[0].description }}</p>
                                            </div>
                                        </div>
                                        <div class="flex justify-end mt-8">
                                            <div class="w-12 h-12 bg-surface-900 rounded-full flex items-center justify-center text-white transform hover:rotate-45 transition-transform">
                                                <i class="pi pi-arrow-up-left text-xl"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Small Cards Grid -->
                                    @for (type of eventTypes.slice(1); track type.label) {
                                        <div class="mega-card bg-white dark:bg-surface-900 p-5 rounded-[24px] flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card cursor-pointer border border-surface-100 dark:border-surface-800"
                                             (click)="selectEventType(type)">
                                            <div class="flex flex-col gap-3">
                                                <div class="w-10 h-10 rounded-xl bg-surface-50 dark:bg-surface-800 flex items-center justify-center group-hover/card:bg-primary/5 transition-colors">
                                                    <i [class]="type.icon" [style.color]="type.color" class="text-lg"></i>
                                                </div>
                                                <div>
                                                    <h4 class="text-lg font-bold text-surface-900 dark:text-surface-0 mb-1">{{ type.label }}</h4>
                                                    <p class="text-xs text-surface-500 line-clamp-2 leading-relaxed">{{ type.description }}</p>
                                                </div>
                                            </div>
                                            <div class="flex justify-end mt-4">
                                                <div class="w-8 h-8 rounded-full border border-surface-200 dark:border-surface-700 flex items-center justify-center text-surface-400 group-hover/card:bg-primary group-hover/card:text-white transition-all transform group-hover/card:rotate-45">
                                                    <i class="pi pi-arrow-up-left text-[10px]"></i>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <!-- Dynamic Selection Label -->
                <div class="flex items-center gap-3 animate-fadein" *ngIf="selectedEventType">
                    <div class="flex flex-col items-end">
                        <span class="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">النمط المختار</span>
                        <div class="flex items-center gap-2 px-6 py-2 bg-primary/5 rounded-full border border-primary/20">
                            <i [class]="selectedIcon" class="text-primary"></i>
                            <span class="text-base font-black text-primary">{{ selectedEventType }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6 pb-24">
                <div class="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <div class="card interactive-card shadow-sm border-none animate-slideup delay-100">
                        <div class="flex items-center justify-between mb-6 border-b pb-4 border-sky-200 dark:border-sky-300">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-info-circle text-primary text-xl"></i>
                                <h2 class="text-xl font-semibold m-0">تفاصيل الحدث الأساسية</h2>
                            </div>
                            <span class="px-3 py-1 bg-surface-100 dark:bg-surface-800 rounded text-xs text-surface-600" *ngIf="selectedEventType">
                                النوع المختار: <strong>{{ selectedEventType }}</strong>
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                            <div class="col-span-12 md:col-span-3 field-container">
                                <label class="field-label mandatory">التنظيم</label>
                                <p-select [(ngModel)]="model.activityType" [options]="activityTypes" appendTo="body" placeholder="اختر التنظيم" class="w-full custom-select" pTooltip="حدد التصنيف العام لهذا الحدث" />
                            </div>

                            <div class="col-span-12 md:col-span-3 field-container">
                                <label class="field-label">نوع النشاط</label>
                                <p-multiselect
                                    [(ngModel)]="model.typeOrgNames"
                                    [options]="typeOrgNameOptions"
                                    appendTo="body"
                                    defaultLabel="اختر نوع أو أكثر"
                                    [showToggleAll]="true"
                                    display="chip"
                                    class="w-full"
                                />
                            </div>

                            <div class="col-span-12 md:col-span-3 field-container">
                                <label class="field-label">تاريخ الحدث</label>
                                <p-datepicker appendTo="body" [(ngModel)]="model.date" dateFormat="yy-mm-dd" [showIcon]="true" class="w-full" placeholder="اختر التاريخ" />
                            </div>

                            <div class="col-span-12 md:col-span-3 field-container">
                                <label class="field-label">وقت الحدث</label>
                                <p-datepicker appendTo="body" [(ngModel)]="model.time" [timeOnly]="true" hourFormat="24" [showIcon]="true" iconDisplay="input" class="w-full" placeholder="00:00" />
                            </div>

                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label mandatory">اسم المهمة أو نوع العملية</label>
                                <p-select [(ngModel)]="model.missionName" [options]="missionNames" appendTo="body" placeholder="اختر المهمة المعنية" class="w-full" />
                            </div>

                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label">جهة الطلب</label>
                                <p-autocomplete
                                    [(ngModel)]="model.requestMu"
                                    [suggestions]="requestMuSuggestions"
                                    (completeMethod)="filterRequestMu($event)"
                                    [dropdown]="true"
                                    appendTo="body"
                                    placeholder="ابدأ البحث عن جهة الطلب..."
                                    class="w-full"
                                />
                            </div>

                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label">تبعية المنجز</label>
                                <p-select [(ngModel)]="model.tab3yeaAlMonjaz" [options]="tab3yeaOptions" appendTo="body" placeholder="حدد التبعية" class="w-full" />
                            </div>

                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label">الجهة المنفذة او المستهدفة</label>
                                <p-select [(ngModel)]="model.targetEntity" [options]="organizationOptions" appendTo="body" placeholder="اختر الجهة" class="w-full" />
                            </div>

                            <div class="col-span-12 field-container">
                                <label class="field-label mandatory">المتن (تفاصيل الخبر أو المعلومة)</label>
                                <textarea pTextarea [(ngModel)]="model.theNews" rows="6" class="w-full resize-none" placeholder="اكتب تفاصيل الحدث هنا بشكل واضح ومفصل..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="card interactive-card shadow-sm border-none animate-slideup delay-200">
                        <div class="flex items-center mb-6 border-b pb-4 border-sky-200 dark:border-sky-300">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-paperclip text-primary text-xl"></i>
                                <h2 class="text-xl font-semibold m-0">المرفقات والارتباطات</h2>
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-6">
                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label mb-3">الأرتباط بالهدف</label>
                                <div class="flex flex-col gap-2">
                                    <p-multiselect
                                        [(ngModel)]="model.targets"
                                        [options]="targetOptions"
                                        defaultLabel="حدد الأهداف المرتبطة"
                                        display="chip"
                                        class="w-full"
                                    />
                                    <p-button label="إضافة هدف جديد" icon="pi pi-plus" [text]="true" size="small" (onClick)="onOpenAddTarget()" />
                                </div>
                            </div>

                            <div class="col-span-12 md:col-span-6 field-container">
                                <label class="field-label mb-3">القوات المساندة الأخرى</label>
                                <p-multiselect
                                    [(ngModel)]="model.otherHands"
                                    [options]="otherHandsOptions"
                                    defaultLabel="اختر الجهات المساندة"
                                    display="chip"
                                    class="w-full"
                                />
                            </div>

                            <div class="col-span-12">
                                <p-table [value]="attachments" [showGridlines]="true" styleClass="p-datatable-sm custom-table-modern">
                                    <ng-template pTemplate="header">
                                        <tr>
                                            <th class="text-center" style="width: 80px">النوع</th>
                                            <th>اسم المرفق</th>
                                            <th class="text-center" style="width: 150px">الإجراءات</th>
                                        </tr>
                                    </ng-template>
                                    <ng-template pTemplate="body" let-row>
                                        <tr class="hover:bg-blue-50/50 transition-colors">
                                            <td class="text-center">
                                                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 mx-auto">
                                                    <i [class]="getFileIcon(row.mimeType)" class="text-xl text-primary"></i>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-surface-900 dark:text-surface-0">{{ row.name }}</span>
                                                    <span class="text-xs text-surface-500">{{ row.mimeType || 'ملف غير معروف' }}</span>
                                                </div>
                                            </td>
                                            <td class="text-center">
                                                <div class="flex items-center justify-center gap-2">
                                                    <p-button *ngIf="row.mimeType?.includes('image')" icon="pi pi-eye" [text]="true" [rounded]="true" severity="info" (onClick)="viewAttachment(row)" pTooltip="مشاهدة" />
                                                    <p-button icon="pi pi-download" [text]="true" [rounded]="true" severity="secondary" (onClick)="downloadAttachment(row)" pTooltip="تحميل" />
                                                    <p-button icon="pi pi-trash" severity="danger" [text]="true" [rounded]="true" (onClick)="removeAttachment(row)" pTooltip="حذف" />
                                                </div>
                                            </td>
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
                </div>

                <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div class="card interactive-card shadow-sm border-none bg-surface-50 dark:bg-surface-900 animate-slideup delay-300">
                        <div class="flex items-center gap-2 mb-6 border-b pb-4 border-sky-200 dark:border-sky-300">
                            <i class="pi pi-file-edit text-primary text-xl"></i>
                            <h2 class="text-xl font-semibold m-0">بيانات المصدر</h2>
                        </div>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div class="col-span-2 field-container">
                                <label class="field-label mandatory">مصدر الخبر</label>
                                <p-autocomplete [(ngModel)]="model.sourceMu" [suggestions]="sourceMuSuggestions" (completeMethod)="filterSourceMu($event)" [dropdown]="true" appendTo="body" placeholder="بحث الوحدة..." class="w-full" />
                            </div>
                            <div class="col-span-2 field-container">
                                <label class="field-label">رقم كتاب المصدر</label>
                                <input pInputText type="text" [(ngModel)]="model.numberBook" class="w-full" placeholder="رقم المرجع" />
                            </div>
                             <div class="col-span-1 field-container">
                                <label class="field-label text-xs">اسم الإضافة</label>
                                <p-select [(ngModel)]="model.nameAdditionArms" [options]="nameAdditionOptions" appendTo="body" placeholder="الإضافة" class="w-full" />
                            </div>
                            <div class="col-span-1 field-container">
                                <label class="field-label text-xs">نوع الإضافة</label>
                                <p-select [(ngModel)]="model.typeArms" [disabled]="!requiresTypeArms(model.nameAdditionArms)" [options]="typeArmsOptions" appendTo="body" placeholder="النوع" class="w-full" />
                            </div>
                            <div class="col-span-1 field-container">
                                <label class="field-label text-xs">رمز الإضافة</label>
                                <p-select [(ngModel)]="model.additionArms" [disabled]="!model.typeArms" [options]="additionArmsOptions" appendTo="body" placeholder="الرمز" class="w-full" />
                            </div>
                            <div class="col-span-1 field-container">
                                <label class="field-label text-xs">قوة الأرض</label>
                                <p-multiselect [(ngModel)]="model.holdingForces" [options]="holdingForceOptions" appendTo="body" defaultLabel="حدد" class="w-full" />
                            </div>
                        </div>
                    </div>

                    <div class="card interactive-card shadow-sm border-none overflow-hidden p-0 animate-slideup delay-300">
                        <div class="p-4 border-b border-sky-200 dark:border-sky-300 bg-white dark:bg-surface-900">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-map-marker text-primary text-xl"></i>
                                    <h2 class="text-xl font-semibold m-0">الموقع الجغرافي</h2>
                                </div>
                                <p-button [label]="showMap ? 'إخفاء الخارطة' : 'تحديد على الخارطة'" [icon]="showMap ? 'pi pi-eye-slash' : 'pi pi-map'" [outlined]="true" size="small" (onClick)="toggleMap()" />
                            </div>
                        </div>
                        <div class="p-3 flex flex-col gap-2">
                            <div class="flex items-center justify-between text-sm bg-primary-50 dark:bg-primary-900/10 p-2 rounded-lg border border-primary-100 dark:border-primary-800 transition-all">
                                <div class="flex items-center gap-2">
                                    <span class="text-surface-500 font-medium text-xs">خط العرض:</span>
                                    <span class="font-bold text-primary tabular-nums">{{ model.coordinates[0] || '--.------' }}</span>
                                </div>
                                <div class="w-px h-4 bg-primary-200 dark:bg-primary-800 mx-2"></div>
                                <div class="flex items-center gap-2">
                                    <span class="text-surface-500 font-medium text-xs">خط الطول:</span>
                                    <span class="font-bold text-primary tabular-nums text-left">{{ model.coordinates[1] || '--.------' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="map-wrapper" [class.expanded]="showMap">
                             <div #mapContainer class="map-container"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom-action-bar flex items-center justify-center p-4">
                <div class="action-container flex flex-wrap items-center justify-between gap-4 max-w-7xl w-full">
                    <div class="flex items-center gap-2">
                        <p-button label="حفظ الحدث" icon="pi pi-check-circle" severity="success" class="action-btn-primary" (onClick)="onSave()" />
                        <p-button label="حفظ كمسودة" icon="pi pi-save" [outlined]="true" severity="secondary" (onClick)="onSaveDraft()" />
                        <div class="flex items-center gap-1">
                            <p-button label="المضبوطات" icon="pi pi-briefcase" [text]="true" severity="secondary" (onClick)="onOpenSeizure()" />
                            <p-button label="إدخال النتائج" icon="pi pi-list" [text]="true" severity="secondary" (onClick)="onOpenResults()" />
                            <p-fileupload name="attachments" mode="basic" chooseLabel="رفع مرفق" chooseIcon="pi pi-upload" [auto]="true" [multiple]="true" styleClass="p-button-text p-button-secondary" (onSelect)="onFilesSelected($event)" />
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="hidden sm:flex flex-col items-end">
                            <span class="text-xs text-surface-500 uppercase tracking-wider font-bold">اكتمال النموذج</span>
                            <div class="flex items-center gap-3">
                                <div class="h-2.5 w-40 bg-sky-200 dark:bg-sky-300 rounded-full overflow-hidden progress-glow">
                                    <div class="h-full bg-primary transition-all duration-1000 ease-in-out relative" [style.width]="calcProgress() + '%'"></div>
                                </div>
                                <span class="text-base font-bold text-primary tabular-nums">{{ calcProgress() }}%</span>
                            </div>
                        </div>
                        <p-button label="جدول الأحداث" icon="pi pi-list" [text]="true" severity="secondary" routerLink="/apps/events/list" />
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .mega-menu-dropdown {
            filter: drop-shadow(0 25px 50px -12px rgb(0 0 0 / 0.15));
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mega-menu-dropdown.visible {
            visibility: visible;
            opacity: 1;
        }
        .mega-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .page-container {
            padding: 2rem;
            background: #f8fafc;
            min-height: 100vh;
        }
        .field-label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--surface-700);
            font-size: 0.95rem;
        }
        .mandatory::after {
            content: " *";
            color: #ef4444;
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
        .bottom-action-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            z-index: 1100;
            box-shadow: 0 -10px 25px -5px rgba(0,0,0,0.05);
        }
        .animate-fadein { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideup { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .interactive-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-100);
        }
    `]
})
export class CreateEvent implements AfterViewInit {
    @ViewChild('mapContainer') mapElement!: ElementRef;
    map!: L.Map;
    marker?: L.Marker;

    showMap = true;
    isMegaMenuOpen = false;
    selectedEventType = '';
    selectedIcon = '';

    eventTypes = [
        { label: 'نشاط أمني', description: 'توثيق الأنشطة والعمليات الأمنية الميدانية والمهمات الخاصة', icon: 'pi pi-shield', color: '#ffc107' },
        { label: 'تقرير موضوعي', description: 'تقييم شامل لموضوع محدد مع التحليل والتوصيات', icon: 'pi pi-file-edit', color: '#03a9f4' },
        { label: 'تقرير جزئي', description: 'تحديثات سريعة وتقارير مختصرة عن حالة معينة', icon: 'pi pi-list', color: '#4caf50' },
        { label: 'برقية إخبارية', description: 'إبلاغ سريع عن حدث طارئ أو معلومة فورية', icon: 'pi pi-send', color: '#f44336' },
        { label: 'محضر تحقيق', description: 'توثيق رسمي للافتادات ووقائع التحقيق والمحاضر', icon: 'pi pi-user-edit', color: '#9c27b0' },
        { label: 'نشاط تدريبي', description: 'سجلات الدورات، الممارسة الميدانية، والتدريب المشترك', icon: 'pi pi-book', color: '#795548' },
        { label: 'إضافة هدف', description: 'تعريف أهداف جديدة في النظام وتحديد المعالم', icon: 'pi pi-map-marker', color: '#607d8b' }
    ];

    model: CreateEventModel = {
        date: null,
        time: null,
        durationHours: null,
        destinationKm: null,
        coordinates: []
    };

    attachments: AttachmentRow[] = [];

    activityTypes = ['مكافحة ارها ب', 'جريمة منظمة', 'أمن داخلي'];
    missionNames = ['عملية البرق', 'مهمة الفجر', 'المراقبة المستمرة'];
    organizationOptions = ['قيادة اليرموك', 'مركز الرشيد', 'مكتب الاستخبارات'];
    typeOrgNameOptions = ['مداهمة', 'تفتيش', 'كمين', 'استطلاع'];
    tab3yeaOptions = ['قوة أمنية', 'مشترك', 'مدني', 'بناء تحتي'];
    otherHandsOptions = ['التحالف الدولي', 'الحشد الشعبي', 'الدفاع المدني'];
    targetOptions = ['منزل مشبوه', 'مخزن سلاح', 'عجلة مستهدفة'];

    nameAdditionOptions = ['ميداني', 'فني', 'بشري'];
    typeArmsOptions = ['سلاح خفيف', 'متفجرات', 'أجهزة اتصال'];
    additionArmsOptions = ['AK47', 'C4', 'Radio-X'];
    holdingForceOptions = ['اللواء 15', 'الشرطة المحلية', 'أمن المنطقة'];

    requestMuSuggestions: string[] = [];
    private allRequestMu = ['جهاز مكافحة الارها ب', 'وزارة الداخلية', 'العمليات المشتركة'];
    sourceMuSuggestions: string[] = [];
    private allSourceMu = ['الاستخبارات العسكرية', 'الأمن الوطني'];

    ngAfterViewInit() {
        if (this.showMap) {
            setTimeout(() => this.initMap(), 500);
        }
    }

    toggleMegaMenu() { this.isMegaMenuOpen = !this.isMegaMenuOpen; }
    openMegaMenu() { this.isMegaMenuOpen = true; }
    closeMegaMenu() { this.isMegaMenuOpen = false; }

    selectEventType(type: any) {
        this.selectedEventType = type.label;
        this.selectedIcon = type.icon;
        this.isMegaMenuOpen = false;
        console.log('Selected Type:', type);
    }

    toggleMap() {
        this.showMap = !this.showMap;
        if (this.showMap) {
            setTimeout(() => {
                if (!this.map) this.initMap();
                else this.map.invalidateSize();
            }, 450);
        }
    }

    private initMap() {
        const iconDefault = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;
        this.map = L.map(this.mapElement.nativeElement).setView([33.3152, 44.3661], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
        this.map.on('click', (e: any) => this.setMarker(e.latlng));
    }

    private setMarker(latlng: L.LatLng) {
        if (this.marker) this.marker.setLatLng(latlng);
        else this.marker = L.marker(latlng, { draggable: true }).addTo(this.map);
        this.model.coordinates = [latlng.lat.toFixed(6), latlng.lng.toFixed(6)];
    }

    filterRequestMu(event: any) {
        this.requestMuSuggestions = this.allRequestMu.filter(x => x.includes(event.query));
    }

    filterSourceMu(event: any) {
        this.sourceMuSuggestions = this.allSourceMu.filter(x => x.includes(event.query));
    }

    requiresTypeArms(val: any) { return val === 'فني' || val === 'بشري'; }

    getFileIcon(mime?: string) {
        if (mime?.includes('image')) return 'pi pi-image';
        return 'pi pi-file';
    }

    onFilesSelected(event: any) {
        for (let file of event.files) {
            this.attachments.push({ name: file.name, mimeType: file.type, objectUrl: URL.createObjectURL(file) });
        }
    }

    downloadAttachment(row: any) { window.open(row.objectUrl); }
    viewAttachment(row: any) { window.open(row.objectUrl, '_blank'); }
    removeAttachment(row: any) { this.attachments = this.attachments.filter(x => x !== row); }

    calcProgress(): number {
        const fields = [this.model.activityType, this.model.missionName, this.model.theNews, this.model.sourceMu];
        return Math.round((fields.filter(f => !!f).length / fields.length) * 100);
    }

    onSaveDraft() { console.log('Draft', this.model); }
    onSave() { console.log('Save', this.model); }
    onOpenSeizure() {}
    onOpenResults() {}
    onOpenAddTarget() {}
    handleEventTypeAction(action: any) {}
}
