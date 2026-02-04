import {Component, ElementRef, HostListener, ViewChild, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Router, NavigationEnd} from '@angular/router';
import {AppMenuitem} from './app.menuitem';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator && item.label !== 'إضافة حدث' && item.label !== 'الأحداث' && item.label !== 'اذرع الجمع' && item.label !== 'الوثائق' && item.label !== 'الدراسات' && item.label !== 'التقارير' && item.label !== 'موقف الوافدين' && item.label !== 'لوحة التحكم' && item.label !== 'الكشوفات'" [item]="item" [index]="i" [root]="true"></li>
                
                <li *ngIf="item.label === 'لوحة التحكم'" class="layout-root-menuitem relative">
                    <div class="flex items-center gap-6">
                        <!-- Dashboard Mega Menu Trigger -->
                        <div #dashTriggerBtn class="relative flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-300 select-none"
                             (click)="toggleDashMegaMenu()" (mouseenter)="openDashMegaMenu()" (mouseleave)="closeDashMegaMenu()">
                            
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <i class="pi pi-home text-primary text-xl"></i>
                                </div>
                                <span class="text-xl font-bold bg-gradient-to-l from-primary to-primary-600 bg-clip-text text-transparent whitespace-nowrap">لوحة التحكم</span>
                                <i class="pi pi-chevron-down text-xs transition-transform duration-300" [class.rotate-180]="isDashMegaMenuOpen"></i>
                            </div>
                        </div>

                        <!-- Dashboard Mega Menu Dropdown -->
                        <div *ngIf="isDashMegaMenuOpen && isDashLocked" class="fixed inset-0 z-[9998] bg-transparent" (click)="closeAllDash()"></div>

                        <div class="mega-menu-dropdown shadow-2xl transition-all duration-300 origin-top-right transform fixed z-[9999]"
                             [class.visible]="isDashMegaMenuOpen"
                             [class.opacity-100]="isDashMegaMenuOpen" [class.scale-100]="isDashMegaMenuOpen"
                             [class.invisible]="!isDashMegaMenuOpen" [class.opacity-0]="!isDashMegaMenuOpen" [class.scale-95]="!isDashMegaMenuOpen"
                             [ngStyle]="dashMenuPosition"
                             (mouseenter)="openDashMegaMenu()" (mouseleave)="closeDashMegaMenu()">
                            
                             <div class="mega-menu-content p-0 bg-white dark:bg-surface-950 rounded-[24px] border border-surface-200 dark:border-surface-800 shadow-2xl w-[900px] overflow-hidden flex select-none">
                                
                                <!-- Fixed Tabs Column (Right side for RTL) -->
                                <div class="w-1/4 bg-surface-50 dark:bg-surface-900/50 border-l border-surface-200 dark:border-surface-800 p-4">
                                    <div class="flex flex-col gap-2">
                                        <div (mouseenter)="dashActiveTab = 'الإحصائيات'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="dashActiveTab === 'الإحصائيات'"
                                             [class.dark:bg-surface-800]="dashActiveTab === 'الإحصائيات'"
                                             [class.shadow-sm]="dashActiveTab === 'الإحصائيات'"
                                             [class.text-primary]="dashActiveTab === 'الإحصائيات'"
                                             [class.font-bold]="dashActiveTab === 'الإحصائيات'">
                                            <i class="pi pi-chart-bar"></i>
                                            <span class="text-lg">الإحصائيات</span>
                                            <i *ngIf="dashActiveTab === 'الإحصائيات'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                        <div (mouseenter)="dashActiveTab = 'الكشوفات'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="dashActiveTab === 'الكشوفات'"
                                             [class.dark:bg-surface-800]="dashActiveTab === 'الكشوفات'"
                                             [class.shadow-sm]="dashActiveTab === 'الكشوفات'"
                                             [class.text-primary]="dashActiveTab === 'الكشوفات'"
                                             [class.font-bold]="dashActiveTab === 'الكشوفات'">
                                            <i class="pi pi-folder-open"></i>
                                            <span class="text-lg">الكشوفات</span>
                                            <i *ngIf="dashActiveTab === 'الكشوفات'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- Content Area (Left side) -->
                                <div class="w-3/4 p-8 bg-white dark:bg-surface-950 scroll-container overflow-y-auto max-h-[600px]">
                                    <!-- الإحصائيات Content -->
                                    <div *ngIf="dashActiveTab === 'الإحصائيات'" class="flex flex-col gap-2 animate-fade-in">
                                        <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 mb-2 px-3 uppercase tracking-wider">التحليل البياني</h4>
                                        <div class="grid grid-cols-2 gap-4">
                                            <a [routerLink]="['/']" (click)="closeAllDash()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                                <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <i class="pi pi-gauge text-blue-500"></i>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-surface-900 dark:text-surface-0">الإحصائيات العامة</span>
                                                    <span class="text-xs text-surface-500">نظرة شاملة على النظام</span>
                                                </div>
                                            </a>
                                            <a [routerLink]="['/dashboard-arrested']" (click)="closeAllDash()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                                <div class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <i class="pi pi-chart-bar text-orange-500"></i>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-surface-900 dark:text-surface-0">إحصائيات المعتقلين</span>
                                                    <span class="text-xs text-surface-500">بيانات وتحليل سجلات المعتقلين</span>
                                                </div>
                                            </a>
                                            <a [routerLink]="['/dashboard-files']" (click)="closeAllDash()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                                <div class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <i class="pi pi-folder text-green-500"></i>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-surface-900 dark:text-surface-0">إحصائيات الملفات</span>
                                                    <span class="text-xs text-surface-500">تحليل وتصنيف الملفات المؤرشفة</span>
                                                </div>
                                            </a>
                                            <a [routerLink]="['/dashboard-infograph']" (click)="closeAllDash()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                                <div class="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <i class="pi pi-chart-pie text-red-500"></i>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-surface-900 dark:text-surface-0">الحصاد</span>
                                                    <span class="text-xs text-surface-500">رسوم بيانية توضح النتائج الميدانية</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>

                                    <!-- الكشوفات Content -->
                                    <div *ngIf="dashActiveTab === 'الكشوفات'" class="animate-fade-in">
                                        <div class="flex items-center justify-between mb-6 px-3">
                                            <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider">السجلات والكشوفات التفصيلية</h4>
                                            <span class="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">15 كشف متاح</span>
                                        </div>
                                        
                                        <div class="grid grid-cols-2 gap-x-6 gap-y-2">
                                            <!-- Group 1: العمليات والأماكن -->
                                            <div class="col-span-2 mt-4 mb-2 border-b border-surface-100 dark:border-surface-800 pb-2 px-3">
                                                <span class="text-xs font-bold text-primary italic">التوزيع الجغرافي والعمليات</span>
                                            </div>
                                            
                                            <a [routerLink]="['/discover/activityTypesInCitys']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-blue-600">
                                                    <i class="pi pi-map text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-primary transition-colors">كشف العمليات في المحافظات</span>
                                            </a>

                                            <a [routerLink]="['/discover/activityTypesInDistrict']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-orange-600">
                                                    <i class="pi pi-map-marker text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-primary transition-colors">كشف العمليات في الأقضية</span>
                                            </a>

                                            <a [routerLink]="['/discover/collectionArmsInCity']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-green-600">
                                                    <i class="pi pi-compass text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-primary transition-colors">كشف مصادر السلاح</span>
                                            </a>

                                            <a [routerLink]="['/discover/collectionSymbolArmsInCity']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-teal-600">
                                                    <i class="pi pi-tags text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-primary transition-colors">كشف رموز مصادر السلاح</span>
                                            </a>

                                            <!-- Group 2: العدو والتنظيم -->
                                            <div class="col-span-2 mt-6 mb-2 border-b border-surface-100 dark:border-surface-800 pb-2 px-3">
                                                <span class="text-xs font-bold text-red-500 italic">نشاط العدو والتنظيم</span>
                                            </div>

                                            <a [routerLink]="['/discover/enemyCasualities']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all text-red-600">
                                                    <i class="pi pi-chart-bar text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-red-500 transition-colors">كشف خسائر العدو</span>
                                            </a>

                                            <a [routerLink]="['/discover/enemyOrgActivity']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all text-slate-600">
                                                    <i class="pi pi-sitemap text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-slate-900 transition-colors">كشف نشاط العدو للأقضية</span>
                                            </a>

                                            <a [routerLink]="['/discover/enemyOrgActivityForDistrict']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all text-slate-600">
                                                    <i class="pi pi-sitemap text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-slate-900 transition-colors">كشف نشاط العدو للمحافظات</span>
                                            </a>

                                            <a [routerLink]="['/discover/maoforgoncity']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all text-purple-600">
                                                    <i class="pi pi-building text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-purple-600 transition-colors">كشف التنظيم في المحافظات</span>
                                            </a>

                                            <!-- Group 3: التحليل الزمني والنوعي -->
                                            <div class="col-span-2 mt-6 mb-2 border-b border-surface-100 dark:border-surface-800 pb-2 px-3">
                                                <span class="text-xs font-bold text-amber-600 italic">التحليل الزمني والنوعي</span>
                                            </div>

                                            <a [routerLink]="['/discover/militaryactivity_at_month']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all text-amber-600">
                                                    <i class="pi pi-calendar text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-amber-600 transition-colors">كشف نوع الأحداث للأشهر</span>
                                            </a>

                                            <a [routerLink]="['/discover/militaryActivityOrg_at_month']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all text-amber-600">
                                                    <i class="pi pi-calendar text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-amber-600 transition-colors">كشف نشاط التنظيم للأشهر</span>
                                            </a>

                                            <a [routerLink]="['/discover/militaryOrg_at_month']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all text-amber-600">
                                                    <i class="pi pi-calendar text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-amber-600 transition-colors">كشف أنشطة التنظيم للأشهر</span>
                                            </a>

                                            <a [routerLink]="['/discover/operationActivity']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-600">
                                                    <i class="pi pi-briefcase text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-indigo-600 transition-colors">كشف العمليات النوعية</span>
                                            </a>

                                            <!-- Group 4: خسائر الصديق والأمن -->
                                            <div class="col-span-2 mt-6 mb-2 border-b border-surface-100 dark:border-surface-800 pb-2 px-3">
                                                <span class="text-xs font-bold text-emerald-600 italic">الأمن والقوات الصديقة</span>
                                            </div>

                                            <a [routerLink]="['/discover/otherHandsActivitys']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all text-emerald-600">
                                                    <i class="pi pi-users text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-emerald-600 transition-colors">كشف أنشطة الجهات الأمنية</span>
                                            </a>

                                            <a [routerLink]="['/discover/ourSidesCasualties']" (click)="closeAllDash()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 group transition-all no-underline border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                                                <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all text-rose-600">
                                                    <i class="pi pi-shield text-sm"></i>
                                                </div>
                                                <span class="text-sm font-medium text-surface-700 dark:text-surface-200 group-hover:text-rose-500 transition-colors">كشف خسائر القوات الأمنية</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </li>

                <li *ngIf="item.label === 'إضافة حدث' && false" class="layout-root-menuitem relative">
                    <div class="flex items-center gap-6">
                        <!-- Mega Menu Trigger -->
                        <div #triggerBtn class="relative flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-300 select-none"
                             (click)="toggleMegaMenu()" (mouseenter)="openMegaMenu()" (mouseleave)="closeMegaMenu()">
                            
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <i class="pi pi-plus-circle text-primary text-xl"></i>
                                </div>
                                <span class="text-xl font-bold bg-gradient-to-l from-primary to-primary-600 bg-clip-text text-transparent whitespace-nowrap">إضافة حدث</span>
                                <i class="pi pi-chevron-down text-xs transition-transform duration-300" [class.rotate-180]="isMegaMenuOpen"></i>
                            </div>
                        </div>

                        <!-- Mega Menu Dropdown Overlay -->
                        <div *ngIf="isMegaMenuOpen && isLocked" class="fixed inset-0 z-[9998] bg-transparent" (click)="closeAll()"></div>

                        <div class="mega-menu-dropdown shadow-2xl transition-all duration-300 origin-top-right transform fixed z-[9999]"
                             [class.visible]="isMegaMenuOpen"
                             [class.opacity-100]="isMegaMenuOpen" [class.scale-100]="isMegaMenuOpen"
                             [class.invisible]="!isMegaMenuOpen" [class.opacity-0]="!isMegaMenuOpen" [class.scale-95]="!isMegaMenuOpen"
                             [ngStyle]="menuPosition"
                             (mouseenter)="openMegaMenu()" (mouseleave)="closeMegaMenu()">
                            
                             <div class="mega-menu-content p-6 bg-[#f0f4f8] dark:bg-surface-950 rounded-[40px] border border-white/50 shadow-2xl w-[900px] select-none">
                                <div class="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr_1fr_1fr] gap-4">
                                    
                                    <!-- 1. Big Hero Card (نشاط أمني) -->
                                    <div class="card-hero bg-[#ffc933] p-10 rounded-[32px] lg:row-span-2 flex flex-col justify-between group/card cursor-pointer transform hover:scale-[1.01] transition-all duration-300 shadow-xl overflow-hidden relative"
                                         (click)="selectEventType(eventTypes[0])">
                                        
                                        <!-- Abstract Background Pattern (Dots/Grid) -->
                                        <div class="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none" 
                                             style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>
                                        
                                        <div class="relative z-10">
                                            <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm">
                                                <i class="pi pi-shield text-[#ffc933] text-4xl"></i>
                                            </div>
                                            <h3 class="text-3xl font-black text-slate-900 mb-4">{{ eventTypes[0].label }}</h3>
                                            <p class="text-slate-800 leading-relaxed text-base max-w-[80%] opacity-90">{{ eventTypes[0].description }}</p>
                                        </div>

                                        <!-- Corner Arrow Button -->
                                        <div class="absolute bottom-8 left-8 w-14 h-14 bg-[#1f5eff] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform transition-transform group-hover/card:rotate-45">
                                            <i class="pi pi-arrow-up-left text-2xl font-bold"></i>
                                        </div>

                                        <!-- Decorative graphic like image -->
                                        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl transition-opacity group-hover/card:opacity-20 pointer-events-none"></div>
                                        
                                        <!-- Custom accent line -->
                                        <div class="absolute top-0 right-10 w-[2px] h-20 bg-black/10"></div>
                                    </div>

                                    <!-- 2. Tall Academy-style Card (تقرير موضوعي) -->
                                    <div class="card-tall bg-white dark:bg-surface-900 p-8 rounded-[32px] lg:row-span-2 flex flex-col justify-between group/card cursor-pointer transform hover:translate-y-[-4px] transition-all duration-300 shadow-md border border-white/20 relative overflow-hidden"
                                         (click)="selectEventType(eventTypes[1])">
                                        
                                        <!-- Side Decoration Stripes -->
                                        <div class="absolute top-0 right-0 w-2 h-full bg-primary/10"></div>
                                        <div class="absolute bottom-10 -right-4 w-24 h-24 border-8 border-primary/5 rounded-full"></div>

                                        <div class="relative z-10">
                                            <div class="w-14 h-14 bg-[#fff9c4] rounded-2xl flex items-center justify-center mb-8">
                                                <i class="pi pi-file-edit text-[#fbc02d] text-2xl"></i>
                                            </div>
                                            <h4 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ eventTypes[1].label }}</h4>
                                            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{{ eventTypes[1].description }}</p>
                                        </div>

                                        <div class="flex justify-end relative z-10">
                                            <div class="w-12 h-12 bg-[#ffcf3a] rounded-full flex items-center justify-center text-slate-900 shadow-md transform transition-transform group-hover/card:rotate-45">
                                                <i class="pi pi-arrow-up-left text-xl"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 3. Small Cards (Grid of Remaining 5) -->
                                    <div class="grid grid-rows-2 gap-4">
                                        <!-- Item 3: تقرير جزئي -->
                                        <div class="card-small bg-white dark:bg-surface-900 p-6 rounded-[28px] flex flex-col justify-between group/card cursor-pointer hover:shadow-xl transition-all duration-300 border border-white/20"
                                             (click)="selectEventType(eventTypes[2])">
                                             <div class="flex shrink-0 items-start justify-between">
                                                 <span class="text-xl font-black text-slate-900 dark:text-white">{{ eventTypes[2].label }}</span>
                                                 <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                     <i class="pi pi-list text-blue-500 text-lg"></i>
                                                 </div>
                                             </div>
                                             <p class="text-slate-400 text-xs mt-3 leading-relaxed opacity-70">{{ eventTypes[2].description }}</p>
                                             <div class="flex justify-end mt-4">
                                                 <div class="w-10 h-10 bg-[#ffcf3a] rounded-full flex items-center justify-center text-slate-900 shadow-sm opacity-0 group-hover/card:opacity-100 transform translate-x-4 group-hover/card:translate-x-0 transition-all duration-300 rotate-45">
                                                     <i class="pi pi-arrow-up-left text-sm"></i>
                                                 </div>
                                             </div>
                                        </div>

                                        <!-- Item 5: محضر تحقيق -->
                                        <div class="card-small bg-white dark:bg-surface-900 p-6 rounded-[28px] flex flex-col justify-between group/card cursor-pointer hover:shadow-xl transition-all duration-300 border border-white/20"
                                             (click)="selectEventType(eventTypes[4])">
                                             <div class="flex shrink-0 items-start justify-between">
                                                 <span class="text-xl font-black text-slate-900 dark:text-white">{{ eventTypes[4].label }}</span>
                                                 <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                                     <i class="pi pi-user-edit text-purple-500 text-lg"></i>
                                                 </div>
                                             </div>
                                             <p class="text-slate-400 text-xs mt-3 leading-relaxed opacity-70">{{ eventTypes[4].description }}</p>
                                             <div class="flex justify-end mt-4">
                                                 <div class="w-10 h-10 bg-[#ffcf3a] rounded-full flex items-center justify-center text-slate-900 shadow-sm opacity-0 group-hover/card:opacity-100 transform translate-x-4 group-hover/card:translate-x-0 transition-all duration-300 rotate-45">
                                                     <i class="pi pi-arrow-up-left text-sm"></i>
                                                 </div>
                                             </div>
                                        </div>
                                    </div>

                                    <div class="grid grid-rows-3 gap-3">
                                        <!-- Item 4: برقية إخبارية -->
                                        <div class="card-news bg-white dark:bg-surface-900 p-5 rounded-[24px] flex flex-col justify-between group/card cursor-pointer hover:shadow-lg transition-all border border-white/20 relative overflow-hidden"
                                             (click)="selectEventType(eventTypes[3])">
                                             
                                             <!-- Urgency Waves -->
                                             <div class="absolute top-0 left-0 w-full h-[3px] bg-red-400/20"></div>
                                             <div class="absolute -top-10 -left-10 w-20 h-20 bg-red-50 rounded-full blur-2xl group-hover/card:bg-red-100 transition-colors"></div>

                                             <div class="flex justify-between items-center relative z-10">
                                                 <h5 class="text-lg font-black text-slate-900 dark:text-white">{{ eventTypes[3].label }}</h5>
                                                 <div class="relative">
                                                     <i class="pi pi-send text-red-500"></i>
                                                     <span class="absolute -top-1 -right-1 flex h-2 w-2">
                                                         <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                         <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                     </span>
                                                 </div>
                                             </div>
                                             <div class="flex justify-end relative z-10">
                                                <div class="w-8 h-8 rounded-full bg-[#ffcf3a] flex items-center justify-center rotate-45 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                    <i class="pi pi-arrow-up-left text-[10px]"></i>
                                                </div>
                                             </div>
                                        </div>

                                        <!-- Item 6: نشاط تدريبي -->
                                        <div class="bg-white dark:bg-surface-900 p-5 rounded-[24px] flex flex-col justify-between group/card cursor-pointer hover:shadow-lg transition-all border border-white/20"
                                             (click)="selectEventType(eventTypes[5])">
                                             <div class="flex justify-between items-center">
                                                 <h5 class="text-lg font-black text-slate-900 dark:text-white">{{ eventTypes[5].label }}</h5>
                                                 <i class="pi pi-book text-brown-500"></i>
                                             </div>
                                             <div class="flex justify-end">
                                                <div class="w-8 h-8 rounded-full bg-[#ffcf3a] flex items-center justify-center rotate-45 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                    <i class="pi pi-arrow-up-left text-[10px]"></i>
                                                </div>
                                             </div>
                                        </div>

                                        <!-- Item 7: إضافة هدف -->
                                        <div class="bg-slate-900 p-5 rounded-[24px] flex flex-col justify-between group/card cursor-pointer hover:bg-slate-800 transition-all"
                                             (click)="selectEventType(eventTypes[6])">
                                             <div class="flex justify-between items-center">
                                                 <h5 class="text-lg font-black text-white">{{ eventTypes[6].label }}</h5>
                                                 <i class="pi pi-map-marker text-primary"></i>
                                             </div>
                                             <div class="flex justify-end">
                                                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center rotate-45">
                                                    <i class="pi pi-arrow-up-left text-[10px] text-slate-900"></i>
                                                </div>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </li>

                <li *ngIf="item.label === 'الأحداث'" class="layout-root-menuitem relative">
                    <div class="flex items-center gap-6">
                        <!-- Events Mega Menu Trigger -->
                        <div #eventsTriggerBtn class="relative flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-300 select-none"
                             (click)="toggleEventsMegaMenu()" (mouseenter)="openEventsMegaMenu()" (mouseleave)="closeEventsMegaMenu()">
                            
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <i class="pi pi-th-large text-primary text-xl"></i>
                                </div>
                                <span class="text-xl font-bold bg-gradient-to-l from-primary to-primary-600 bg-clip-text text-transparent">الأحداث</span>
                                <i class="pi pi-chevron-down text-xs transition-transform duration-300" [class.rotate-180]="isEventsMegaMenuOpen"></i>
                            </div>
                        </div>

                        <!-- Events Mega Menu Dropdown -->
                        <div *ngIf="isEventsMegaMenuOpen && isEventsLocked" class="fixed inset-0 z-[9998] bg-transparent" (click)="closeAllEvents()"></div>

                        <div class="mega-menu-dropdown shadow-2xl transition-all duration-300 origin-top-right transform fixed z-[9999]"
                             [class.visible]="isEventsMegaMenuOpen"
                             [class.opacity-100]="isEventsMegaMenuOpen" [class.scale-100]="isEventsMegaMenuOpen"
                             [class.invisible]="!isEventsMegaMenuOpen" [class.opacity-0]="!isEventsMegaMenuOpen" [class.scale-95]="!isEventsMegaMenuOpen"
                             [ngStyle]="eventsMenuPosition"
                             (mouseenter)="openEventsMegaMenu()" (mouseleave)="closeEventsMegaMenu()">
                            
                             <div class="mega-menu-content p-0 bg-white dark:bg-surface-950 rounded-[24px] border border-surface-200 dark:border-surface-800 shadow-2xl w-[600px] overflow-hidden flex select-none">
                                
                                <!-- Fixed Tabs Column (Right side for RTL) -->
                                <div class="w-1/3 bg-surface-50 dark:bg-surface-900/50 border-l border-surface-200 dark:border-surface-800 p-4">
                                    <div class="flex flex-col gap-2">
                                        <div (mouseenter)="eventsActiveTab = 'جدول'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="eventsActiveTab === 'جدول'"
                                             [class.dark:bg-surface-800]="eventsActiveTab === 'جدول'"
                                             [class.shadow-sm]="eventsActiveTab === 'جدول'"
                                             [class.text-primary]="eventsActiveTab === 'جدول'"
                                             [class.font-bold]="eventsActiveTab === 'جدول'">
                                            <i class="pi pi-calendar"></i>
                                            <span class="text-lg">جدول</span>
                                            <i *ngIf="eventsActiveTab === 'جدول'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                        <div (mouseenter)="eventsActiveTab = 'ملف 103'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="eventsActiveTab === 'ملف 103'"
                                             [class.dark:bg-surface-800]="eventsActiveTab === 'ملف 103'"
                                             [class.shadow-sm]="eventsActiveTab === 'ملف 103'"
                                             [class.text-primary]="eventsActiveTab === 'ملف 103'"
                                             [class.font-bold]="eventsActiveTab === 'ملف 103'">
                                            <i class="pi pi-star"></i>
                                            <span class="text-lg">ملف 103</span>
                                            <i *ngIf="eventsActiveTab === 'ملف 103'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- Content Area (Left side) -->
                                <div class="w-2/3 p-6 bg-white dark:bg-surface-950">
                                    <!-- جدول Content -->
                                    <div *ngIf="eventsActiveTab === 'جدول'" class="flex flex-col gap-2 animate-fade-in">
                                        <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 mb-2 px-3 uppercase tracking-wider">القائمة الأساسية</h4>
                                        <a [routerLink]="['/apps/events/create/choose']" (click)="closeAllEvents()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-plus text-primary"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">إضافة حدث</span>
                                                <span class="text-xs text-surface-500">البدء بإنشاء حدث أمني جديد</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/apps/events/list']" (click)="closeAllEvents()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-calendar text-blue-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">جدول الأحداث</span>
                                                <span class="text-xs text-surface-500">عرض كافة الأحداث المسجلة</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/apps/events/check']" (click)="closeAllEvents()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-search text-orange-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">تدقيق الحدث</span>
                                                <span class="text-xs text-surface-500">مراجعة وتدقيق جودة البيانات</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/apps/events/completing']" (click)="closeAllEvents()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-check text-green-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">استكمال الحدث</span>
                                                <span class="text-xs text-surface-500">إضافة المرفقات والبيانات الناقصة</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/apps/events/refused']" (click)="closeAllEvents()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-times text-red-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">الأحداث المرفوضة</span>
                                                <span class="text-xs text-surface-500">الأحداث التي لم يتم قبولها</span>
                                            </div>
                                        </a>
                                    </div>

                                    <!-- ملف 103 Content -->
                                    <div *ngIf="eventsActiveTab === 'ملف 103'" class="flex flex-col gap-2 animate-fade-in">
                                        <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 mb-2 px-3 uppercase tracking-wider">الرصد والمتابعة</h4>
                                        <a [routerLink]="['/uikit/create']" (click)="closeAllEvents()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-plus text-purple-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">إنشاء رصد جوي</span>
                                                <span class="text-xs text-surface-500">بدء تقرير رصد جديد</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/uikit/lost']" (click)="closeAllEvents()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-list text-indigo-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">النتائج</span>
                                                <span class="text-xs text-surface-500">عرض نتائج الرصد والمخرجات</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </li>

                <li *ngIf="item.label === 'اذرع الجمع'" class="layout-root-menuitem relative">
                    <div class="flex items-center gap-6">
                        <!-- Arms Mega Menu Trigger -->
                        <div #armsTriggerBtn class="relative flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-300 select-none"
                             (click)="toggleArmsMegaMenu()" (mouseenter)="openArmsMegaMenu()" (mouseleave)="closeArmsMegaMenu()">
                            
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <i class="pi pi-sitemap text-primary text-xl"></i>
                                </div>
                                <span class="text-xl font-bold bg-gradient-to-l from-primary to-primary-600 bg-clip-text text-transparent whitespace-nowrap">أذرع الجمع</span>
                                <i class="pi pi-chevron-down text-xs transition-transform duration-300" [class.rotate-180]="isArmsMegaMenuOpen"></i>
                            </div>
                        </div>

                        <!-- Arms Mega Menu Dropdown -->
                        <div *ngIf="isArmsMegaMenuOpen && isArmsLocked" class="fixed inset-0 z-[9998] bg-transparent" (click)="closeAllArms()"></div>

                        <div class="mega-menu-dropdown shadow-2xl transition-all duration-300 origin-top-right transform fixed z-[9999]"
                             [class.visible]="isArmsMegaMenuOpen"
                             [class.opacity-100]="isArmsMegaMenuOpen" [class.scale-100]="isArmsMegaMenuOpen"
                             [class.invisible]="!isArmsMegaMenuOpen" [class.opacity-0]="!isArmsMegaMenuOpen" [class.scale-95]="!isArmsMegaMenuOpen"
                             [ngStyle]="armsMenuPosition"
                             (mouseenter)="openArmsMegaMenu()" (mouseleave)="closeArmsMegaMenu()">
                            
                             <div class="mega-menu-content p-0 bg-white dark:bg-surface-950 rounded-[24px] border border-surface-200 dark:border-surface-800 shadow-2xl w-[600px] overflow-hidden flex select-none">
                                
                                <!-- Fixed Tabs Column (Right side for RTL) -->
                                <div class="w-1/3 bg-surface-50 dark:bg-surface-900/50 border-l border-surface-200 dark:border-surface-800 p-4">
                                    <div class="flex flex-col gap-2">
                                        <div (mouseenter)="armsActiveTab = 'ذراع الجمع'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="armsActiveTab === 'ذراع الجمع'"
                                             [class.dark:bg-surface-800]="armsActiveTab === 'ذراع الجمع'"
                                             [class.shadow-sm]="armsActiveTab === 'ذراع الجمع'"
                                             [class.text-primary]="armsActiveTab === 'ذراع الجمع'"
                                             [class.font-bold]="armsActiveTab === 'ذراع الجمع'">
                                            <i class="pi pi-sitemap"></i>
                                            <span class="text-lg">ذراع الجمع</span>
                                            <i *ngIf="armsActiveTab === 'ذراع الجمع'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                        <div (mouseenter)="armsActiveTab = 'ضابط المصدر'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="armsActiveTab === 'ضابط المصدر'"
                                             [class.dark:bg-surface-800]="armsActiveTab === 'ضابط المصدر'"
                                             [class.shadow-sm]="armsActiveTab === 'ضابط المصدر'"
                                             [class.text-primary]="armsActiveTab === 'ضابط المصدر'"
                                             [class.font-bold]="armsActiveTab === 'ضابط المصدر'">
                                            <i class="pi pi-user"></i>
                                            <span class="text-lg">ضابط المصدر</span>
                                            <i *ngIf="armsActiveTab === 'ضابط المصدر'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- Content Area (Left side) -->
                                <div class="w-2/3 p-6 bg-white dark:bg-surface-950">
                                    <!-- ذراع الجمع Content -->
                                    <div *ngIf="armsActiveTab === 'ذراع الجمع'" class="flex flex-col gap-2 animate-fade-in">
                                        <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 mb-2 px-3 uppercase tracking-wider">إدارة الأذرع</h4>
                                        <a [routerLink]="['/apps/additionArms/create']" (click)="closeAllArms()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-plus text-blue-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">إضافة ذراع</span>
                                                <span class="text-xs text-surface-500">تسجيل ذراع جمع جديد</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/apps/additionArms/list']" (click)="closeAllArms()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-table text-orange-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">جدول الأذرع</span>
                                                <span class="text-xs text-surface-500">عرض وإدارة كافة الأذرع</span>
                                            </div>
                                        </a>
                                    </div>

                                    <!-- ضابط المصدر Content -->
                                    <div *ngIf="armsActiveTab === 'ضابط المصدر'" class="flex flex-col gap-2 animate-fade-in">
                                        <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 mb-2 px-3 uppercase tracking-wider">إدارة الضباط</h4>
                                        <a [routerLink]="['/apps/additionArms/sourceOfficer/create']" (click)="closeAllArms()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-user-plus text-green-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">إضافة ضابط مصدر</span>
                                                <span class="text-xs text-surface-500">تسجيل بيانات ضابط مصدر جديد</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/apps/additionArms/sourceOfficer/list']" (click)="closeAllArms()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-users text-indigo-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">قائمة ضباط المصدر</span>
                                                <span class="text-xs text-surface-500">إدارة سجلات ضباط المصادر</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </li>

                <li *ngIf="item.label === 'الوثائق'" class="layout-root-menuitem relative">
                    <div class="flex items-center gap-6">
                        <!-- Docs Mega Menu Trigger -->
                        <div #docsTriggerBtn class="relative flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-300 select-none"
                             (click)="toggleDocsMegaMenu()" (mouseenter)="openDocsMegaMenu()" (mouseleave)="closeDocsMegaMenu()">
                            
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <i class="pi pi-file-pdf text-primary text-xl"></i>
                                </div>
                                <span class="text-xl font-bold bg-gradient-to-l from-primary to-primary-600 bg-clip-text text-transparent">الوثائق</span>
                                <i class="pi pi-chevron-down text-xs transition-transform duration-300" [class.rotate-180]="isDocsMegaMenuOpen"></i>
                            </div>
                        </div>

                        <!-- Docs Mega Menu Dropdown -->
                        <div *ngIf="isDocsMegaMenuOpen && isDocsLocked" class="fixed inset-0 z-[9998] bg-transparent" (click)="closeAllDocs()"></div>

                        <div class="mega-menu-dropdown shadow-2xl transition-all duration-300 origin-top-right transform fixed z-[9999]"
                             [class.visible]="isDocsMegaMenuOpen"
                             [class.opacity-100]="isDocsMegaMenuOpen" [class.scale-100]="isDocsMegaMenuOpen"
                             [class.invisible]="!isDocsMegaMenuOpen" [class.opacity-0]="!isDocsMegaMenuOpen" [class.scale-95]="!isDocsMegaMenuOpen"
                             [ngStyle]="docsMenuPosition"
                             (mouseenter)="openDocsMegaMenu()" (mouseleave)="closeDocsMegaMenu()">
                            
                             <div class="mega-menu-content p-0 bg-white dark:bg-surface-950 rounded-[24px] border border-surface-200 dark:border-surface-800 shadow-2xl w-[600px] overflow-hidden flex select-none">
                                
                                <!-- Fixed Tabs Column (Right side for RTL) -->
                                <div class="w-1/3 bg-surface-50 dark:bg-surface-900/50 border-l border-surface-200 dark:border-surface-800 p-4">
                                    <div class="flex flex-col gap-2">
                                        <div (mouseenter)="docsActiveTab = 'الدراسات'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="docsActiveTab === 'الدراسات'"
                                             [class.dark:bg-surface-800]="docsActiveTab === 'الدراسات'"
                                             [class.shadow-sm]="docsActiveTab === 'الدراسات'"
                                             [class.text-primary]="docsActiveTab === 'الدراسات'"
                                             [class.font-bold]="docsActiveTab === 'الدراسات'">
                                            <i class="pi pi-book"></i>
                                            <span class="text-lg">الدراسات</span>
                                            <i *ngIf="docsActiveTab === 'الدراسات'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                        <div (mouseenter)="docsActiveTab = 'التقارير'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="docsActiveTab === 'التقارير'"
                                             [class.dark:bg-surface-800]="docsActiveTab === 'التقارير'"
                                             [class.shadow-sm]="docsActiveTab === 'التقارير'"
                                             [class.text-primary]="docsActiveTab === 'التقارير'"
                                             [class.font-bold]="docsActiveTab === 'التقارير'">
                                            <i class="pi pi-file"></i>
                                            <span class="text-lg">التقارير</span>
                                            <i *ngIf="docsActiveTab === 'التقارير'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                        <div (mouseenter)="docsActiveTab = 'موقف الوافدين'" 
                                             class="flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200"
                                             [class.bg-white]="docsActiveTab === 'موقف الوافدين'"
                                             [class.dark:bg-surface-800]="docsActiveTab === 'موقف الوافدين'"
                                             [class.shadow-sm]="docsActiveTab === 'موقف الوافدين'"
                                             [class.text-primary]="docsActiveTab === 'موقف الوافدين'"
                                             [class.font-bold]="docsActiveTab === 'موقف الوافدين'">
                                            <i class="pi pi-users"></i>
                                            <span class="text-lg">الوافدين</span>
                                            <i *ngIf="docsActiveTab === 'موقف الوافدين'" class="pi pi-chevron-left mr-auto text-[10px]"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- Content Area (Left side) -->
                                <div class="w-2/3 p-6 bg-white dark:bg-surface-950">
                                    <!-- الدراسات Content -->
                                    <div *ngIf="docsActiveTab === 'الدراسات'" class="flex flex-col gap-2 animate-fade-in">
                                        <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 mb-2 px-3 uppercase tracking-wider">إدارة الدراسات</h4>
                                        <a [routerLink]="['/study/create']" (click)="closeAllDocs()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-plus text-blue-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">إضافة دراسة</span>
                                                <span class="text-xs text-surface-500">بدء دراسة أمنية جديدة</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/study/list']" (click)="closeAllDocs()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-list text-orange-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">قائمة الدراسات</span>
                                                <span class="text-xs text-surface-500">استعراض كافة الدراسات</span>
                                            </div>
                                        </a>
                                    </div>

                                    <!-- التقارير Content -->
                                    <div *ngIf="docsActiveTab === 'التقارير'" class="flex flex-col gap-2 animate-fade-in">
                                        <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 mb-2 px-3 uppercase tracking-wider">التقارير الرسمية</h4>
                                        <a [routerLink]="['/report/create']" (click)="closeAllDocs()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-plus-circle text-green-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">إضافة تقرير</span>
                                                <span class="text-xs text-surface-500">إنشاء تقرير دوري أو خاص</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/report/list']" (click)="closeAllDocs()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-list text-indigo-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">قائمة التقارير</span>
                                                <span class="text-xs text-surface-500">استعراض سجلات التقارير</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/report/print']" (click)="closeAllDocs()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-print text-red-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">طباعة تقرير</span>
                                                <span class="text-xs text-surface-500">تصدير وطباعة التقارير المعتمدة</span>
                                            </div>
                                        </a>
                                    </div>

                                    <!-- موقف الوافدين Content -->
                                    <div *ngIf="docsActiveTab === 'موقف الوافدين'" class="flex flex-col gap-2 animate-fade-in">
                                        <h4 class="text-sm font-bold text-surface-400 dark:text-surface-500 mb-2 px-3 uppercase tracking-wider">متابعة الوافدين</h4>
                                        <a [routerLink]="['/positionOfArrivals/create']" (click)="closeAllDocs()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-user-plus text-purple-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">إضافة موقف</span>
                                                <span class="text-xs text-surface-500">تسجيل موقف جديد للوافدين</span>
                                            </div>
                                        </a>
                                        <a [routerLink]="['/positionOfArrivals/list']" (click)="closeAllDocs()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 group transition-all no-underline">
                                            <div class="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i class="pi pi-users text-teal-500"></i>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-surface-900 dark:text-surface-0">قائمة المواقف</span>
                                                <span class="text-xs text-surface-500">إحصائيات وسجلات الوافدين</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </li>

                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `,
    styles: [`
        .mega-menu-dropdown {
            visibility: hidden;
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            pointer-events: none;
        }
        .mega-menu-dropdown::before {
            content: "";
            position: absolute;
            top: -20px;
            left: 0;
            right: 0;
            height: 20px;
            background: transparent;
        }
        .mega-menu-dropdown.visible {
            visibility: visible;
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
        }
        
        .mega-menu-content {
            filter: drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.1));
            font-size: 13px;
        }
        
        .mega-menu-content h1, 
        .mega-menu-content h2, 
        .mega-menu-content h3, 
        .mega-menu-content h4, 
        .mega-menu-content h5, 
        .mega-menu-content h6,
        .mega-menu-content span,
        .mega-menu-content p,
        .mega-menu-content a {
            font-size: 13px !important;
        }

        /* Hover animations and transitions */
        .card-hero, .card-tall, .card-small {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Specific glow for yellow card */
        .card-hero:hover {
            box-shadow: 0 25px 50px -12px rgba(255, 201, 51, 0.4);
        }

        /* Decorative Line for Hero Card */
        .card-hero::after {
            content: "";
            position: absolute;
            top: 40px;
            right: 40px;
            width: 60px;
            height: 2px;
            background: rgba(0,0,0,0.1);
            transform: rotate(-45deg);
        }

        /* Dash patterns for Tall Card */
        .card-tall::before {
            content: "";
            position: absolute;
            top: 20px;
            left: 20px;
            width: 30px;
            height: 30px;
            border-top: 2px solid rgba(0,0,0,0.05);
            border-left: 2px solid rgba(0,0,0,0.05);
        }

        /* 1. Animation for Hero Card (Floating Icon) */
        .card-hero:hover .pi-shield {
            animation: float 2s ease-in-out infinite;
        }

        /* 2. Animation for Tall Card (Subtle Pulse) */
        .card-tall:hover {
            animation: card-pulse 1.5s ease-in-out infinite;
        }

        /* 3. Animation for Small Card (Icon Spin) */
        .card-small:hover .pi-list {
            animation: icon-spin 0.6s ease-in-out;
        }

        /* 4. Animation for Black Target Card (Bouncing Marker) */
        .bg-slate-900:hover .pi-map-marker {
            animation: marker-bounce 1s infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes card-pulse {
            0% { transform: translateY(-4px) scale(1); }
            50% { transform: translateY(-6px) scale(1.01); }
            100% { transform: translateY(-4px) scale(1); }
        }

        @keyframes icon-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes marker-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        @keyframes fade-in {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
    `]
})

export class AppMenu {
    @ViewChild('triggerBtn') triggerBtn!: ElementRef;
    @ViewChild('eventsTriggerBtn') eventsTriggerBtn!: ElementRef;
    @ViewChild('armsTriggerBtn') armsTriggerBtn!: ElementRef;
    @ViewChild('docsTriggerBtn') docsTriggerBtn!: ElementRef;
    @ViewChild('dashTriggerBtn') dashTriggerBtn!: ElementRef;
    
    activeMenuKey: string | null = null;
    isLocked = false;
    private closeTimeout: any;

    get isMegaMenuOpen() { return this.activeMenuKey === 'addEvent'; }
    get isEventsMegaMenuOpen() { return this.activeMenuKey === 'events'; }
    get isArmsMegaMenuOpen() { return this.activeMenuKey === 'arms'; }
    get isDocsMegaMenuOpen() { return this.activeMenuKey === 'docs'; }
    get isDashMegaMenuOpen() { return this.activeMenuKey === 'dash'; }

    get isLockedCurrent() { return this.isLocked; }
    // These are for backward compatibility with template
    get isEventsLocked() { return this.isLocked && this.activeMenuKey === 'events'; }
    get isArmsLocked() { return this.isLocked && this.activeMenuKey === 'arms'; }
    get isDocsLocked() { return this.isLocked && this.activeMenuKey === 'docs'; }
    get isDashLocked() { return this.isLocked && this.activeMenuKey === 'dash'; }

    menuPosition = {};
    eventsActiveTab: 'جدول' | 'ملف 103' = 'جدول';
    eventsMenuPosition = {};

    armsActiveTab: 'ذراع الجمع' | 'ضابط المصدر' = 'ذراع الجمع';
    armsMenuPosition = {};

    docsActiveTab: 'الدراسات' | 'التقارير' | 'موقف الوافدين' = 'الدراسات';
    docsMenuPosition = {};

    dashActiveTab: 'الإحصائيات' | 'الكشوفات' = 'الإحصائيات';
    dashMenuPosition = {};
    
    eventTypes = [
        { label: 'نشاط أمني', description: 'توثيق الأنشطة والعمليات الأمنية الميدانية والمهمات الخاصة', icon: 'pi pi-shield', color: '#ffc107' },
        { label: 'تقرير موضوعي', description: 'تقييم شامل لموضوع محدد مع التحليل والتوصيات', icon: 'pi pi-file-edit', color: '#03a9f4' },
        { label: 'تقرير جزئي', description: 'تحديثات سريعة وتقارير مختصرة عن حالة معينة', icon: 'pi pi-list', color: '#4caf50' },
        { label: 'برقية', description: 'إبلاغ سريع عن حدث طارئ أو معلومة فورية', icon: 'pi pi-send', color: '#f44336' },
        { label: 'حدث أمني', description: 'توثيق رسمي للافتادات ووقائع التحقيق والمحاضر', icon: 'pi pi-user-edit', color: '#9c27b0' },
        { label: 'أخبار عاجلة', description: 'سجلات الدورات، الممارسة الميدانية، والتدريب المشترك', icon: 'pi pi-bolt', color: '#795548' },
        { label: 'دراسة', description: 'تعريف أهداف جديدة في النظام وتحديد المعالم', icon: 'pi pi-map-marker', color: '#607d8b' }
    ];

    constructor(private router: Router, private cd: ChangeDetectorRef) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.closeAll();
            }
        });
    }

    @HostListener('window:keydown.escape')
    onEscape() {
        this.closeAll();
    }

    private cancelAllTimeouts() {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = null;
        }
    }

    updateMenuPosition() {
        if (this.triggerBtn) {
            const rect = this.triggerBtn.nativeElement.getBoundingClientRect();
            this.menuPosition = {
                top: `${rect.bottom + 12}px`,
                right: `${window.innerWidth - rect.right}px`
            };
        }
    }

    updateEventsMenuPosition() {
        if (this.eventsTriggerBtn) {
            const rect = this.eventsTriggerBtn.nativeElement.getBoundingClientRect();
            this.eventsMenuPosition = {
                top: `${rect.bottom + 12}px`,
                right: `${window.innerWidth - rect.right}px`
            };
        }
    }

    updateArmsMenuPosition() {
        if (this.armsTriggerBtn) {
            const rect = this.armsTriggerBtn.nativeElement.getBoundingClientRect();
            this.armsMenuPosition = {
                top: `${rect.bottom + 12}px`,
                right: `${window.innerWidth - rect.right}px`
            };
        }
    }

    updateDocsMenuPosition() {
        if (this.docsTriggerBtn) {
            const rect = this.docsTriggerBtn.nativeElement.getBoundingClientRect();
            this.docsMenuPosition = {
                top: `${rect.bottom + 12}px`,
                right: `${window.innerWidth - rect.right}px`
            };
        }
    }

    updateDashMenuPosition() {
        if (this.dashTriggerBtn) {
            const rect = this.dashTriggerBtn.nativeElement.getBoundingClientRect();
            this.dashMenuPosition = {
                top: `${rect.bottom + 12}px`,
                right: `${window.innerWidth - rect.right}px`
            };
        }
    }

    toggleMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'addEvent') {
            this.updateMenuPosition();
            this.activeMenuKey = 'addEvent';
            this.isLocked = true;
        } else {
            this.activeMenuKey = null;
            this.isLocked = false;
        }
        this.cd.detectChanges();
    }

    toggleEventsMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'events') {
            this.updateEventsMenuPosition();
            this.activeMenuKey = 'events';
            this.isLocked = true;
        } else {
            this.activeMenuKey = null;
            this.isLocked = false;
        }
        this.cd.detectChanges();
    }

    toggleArmsMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'arms') {
            this.updateArmsMenuPosition();
            this.activeMenuKey = 'arms';
            this.isLocked = true;
        } else {
            this.activeMenuKey = null;
            this.isLocked = false;
        }
        this.cd.detectChanges();
    }

    toggleDocsMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'docs') {
            this.updateDocsMenuPosition();
            this.activeMenuKey = 'docs';
            this.isLocked = true;
        } else {
            this.activeMenuKey = null;
            this.isLocked = false;
        }
        this.cd.detectChanges();
    }

    toggleDashMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'dash') {
            this.updateDashMenuPosition();
            this.activeMenuKey = 'dash';
            this.isLocked = true;
        } else {
            this.activeMenuKey = null;
            this.isLocked = false;
        }
        this.cd.detectChanges();
    }

    openMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'addEvent' || !this.isLocked) {
            this.updateMenuPosition();
            this.activeMenuKey = 'addEvent';
            this.cd.detectChanges();
        }
    }

    openEventsMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'events' || !this.isLocked) {
            this.updateEventsMenuPosition();
            this.activeMenuKey = 'events';
            this.cd.detectChanges();
        }
    }

    openArmsMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'arms' || !this.isLocked) {
            this.updateArmsMenuPosition();
            this.activeMenuKey = 'arms';
            this.cd.detectChanges();
        }
    }

    openDocsMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'docs' || !this.isLocked) {
            this.updateDocsMenuPosition();
            this.activeMenuKey = 'docs';
            this.cd.detectChanges();
        }
    }

    openDashMegaMenu() { 
        this.cancelAllTimeouts();
        if (this.activeMenuKey !== 'dash' || !this.isLocked) {
            this.updateDashMenuPosition();
            this.activeMenuKey = 'dash';
            this.cd.detectChanges();
        }
    }

    scheduleClose(key: string) {
        if (this.isLocked && this.activeMenuKey === key) return;
        this.cancelAllTimeouts();
        this.closeTimeout = setTimeout(() => {
            if (this.activeMenuKey === key) {
                this.activeMenuKey = null;
                this.cd.detectChanges();
            }
        }, 200); 
    }

    cancelClose() {
        this.cancelAllTimeouts();
    }

    cancelEventsClose() { this.cancelAllTimeouts(); }
    cancelArmsClose() { this.cancelAllTimeouts(); }
    cancelDocsClose() { this.cancelAllTimeouts(); }
    cancelDashClose() { this.cancelAllTimeouts(); }

    closeMegaMenu() { this.scheduleClose('addEvent'); }
    closeEventsMegaMenu() { this.scheduleClose('events'); }
    closeArmsMegaMenu() { this.scheduleClose('arms'); }
    closeDocsMegaMenu() { this.scheduleClose('docs'); }
    closeDashMegaMenu() { this.scheduleClose('dash'); }

    closeAll() {
        this.cancelAllTimeouts();
        this.activeMenuKey = null;
        this.isLocked = false;
        this.cd.detectChanges();
    }

    closeAllEvents() { this.closeAll(); }
    closeAllArms() { this.closeAll(); }
    closeAllDocs() { this.closeAll(); }
    closeAllDash() { this.closeAll(); }

    selectEventType(type: any) {
        this.closeAll();
        this.router.navigate(['/apps/events/create'], { queryParams: { type: type.label } });
    }

    model: any[] = [
        {
            label: 'لوحة التحكم',
            icon: 'pi pi-home',
            items: [
                {
                    label: 'الإحصائيات العامة',
                    icon: 'pi pi-fw pi-gauge',
                    routerLink: ['/']
                },
                {
                    label: 'إحصائيات المعتقلين',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: ['/dashboard-arrested']
                },
                {
                    label: 'إحصائيات الملفات',
                    icon: 'pi pi-fw pi-folder',
                    routerLink: ['/dashboard-files']
                },
                {
                    label: 'الحصاد',
                    icon: 'pi pi-fw pi-chart-pie',
                    routerLink: ['/dashboard-infograph']
                }
            ]
        },
        {separator: true},
        {
            label: 'الأحداث',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'جدول الأحداث',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink: ['/apps/events/list']
                },
                {
                    label: 'تدقيق',
                    icon: 'pi pi-fw pi-search',
                    routerLink: ['/apps/events/check']
                },
                {
                    label: 'استكمال',
                    icon: 'pi pi-fw pi-check',
                    routerLink: ['/apps/events/completing']
                },
                {
                    label: 'الأحداث المرفوضة',
                    icon: 'pi pi-fw pi-times',
                    routerLink: ['/apps/events/refused']
                },
                {
                    label: 'ملف 103',
                    icon: 'pi pi-fw pi-star-fill',
                    items: [
                        {
                            label: 'إنشاء رصد جوي',
                            icon: 'pi pi-fw pi-plus',
                            routerLink: ['/uikit/create']
                        },
                        {
                            label: 'النتائج',
                            icon: 'pi pi-fw pi-list',
                            routerLink: ['/uikit/lost']
                        }
                    ]
                }
            ]
        },
        {separator: true},
        {
            label: 'اذرع الجمع',
            icon: 'pi pi-fw pi-sitemap',
            items: [
                {
                    label: 'اضافة ذراع جمع',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/apps/additionArms/create']
                },
                {
                    label: 'جدول اذرع الجمع',
                    icon: 'pi pi-fw pi-table',
                    routerLink: ['/apps/additionArms/list']
                },
                {
                    label: 'اضافة ضابط مصدر',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/apps/additionArms/sourceOfficer/create']
                },
                {
                    label: 'قائمة ضباط المصدر',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/apps/additionArms/sourceOfficer/list']
                }
            ]
        },
        {separator: true},
        {
            label: 'الوثائق',
            icon: 'pi pi-fw pi-file-pdf',
            items: []
        },
        {separator: true},
        {
            label: 'الكشوفات',
            icon: 'pi pi-fw pi-folder-open',
            items: [
                {
                    label: 'كشف العمليات في المحافظات',
                    icon: 'pi pi-fw pi-map',
                    routerLink: ['/discover/activityTypesInCitys']
                },
                {
                    label: 'كشف العمليات في الأقضية',
                    icon: 'pi pi-fw pi-map-marker',
                    routerLink: ['/discover/activityTypesInDistrict']
                },
                {
                    label: 'كشف مصادر السلاح في المحافظات',
                    icon: 'pi pi-fw pi-compass',
                    routerLink: ['/discover/collectionArmsInCity']
                },
                {
                    label: 'كشف رموز مصادر السلاح في المحافظات',
                    icon: 'pi pi-fw pi-tags',
                    routerLink: ['/discover/collectionSymbolArmsInCity']
                },
                {
                    label: 'كشف خسائر العدو',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: ['/discover/enemyCasualities']
                },
                {
                    label: 'كشف نشاط تنظيم العدو للمحافظات',
                    icon: 'pi pi-fw pi-sitemap',
                    routerLink: ['/discover/enemyOrgActivity']
                },
                {
                    label: 'كشف نشاط تنظيم العدو للأقضية',
                    icon: 'pi pi-fw pi-sitemap',
                    routerLink: ['/discover/enemyOrgActivityForDistrict']
                },
                {
                    label: 'كشف التنظيم في المحافظات',
                    icon: 'pi pi-fw pi-building',
                    routerLink: ['/discover/maoforgoncity']
                },
                {
                    label: 'كشف تنظيم العدو في المحافظات',
                    icon: 'pi pi-fw pi-building',
                    routerLink: ['/discover/maoforgoncityEnemay']
                },
                {
                    label: 'كشف نوع الأحداث للأشهر',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink: ['/discover/militaryactivity_at_month']
                },
                {
                    label: 'كشف نشاط التنظيم للأشهر',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink: ['/discover/militaryActivityOrg_at_month']
                },
                {
                    label: 'كشف أنشطة التنظيم للأشهر',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink: ['/discover/militaryOrg_at_month']
                },
                {
                    label: 'كشف العمليات النوعية',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/discover/operationActivity']
                },
                {
                    label: 'كشف أنشطة الجهات الأمنية',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/discover/otherHandsActivitys']
                },
                {
                    label: 'كشف خسائر القوات الأمنية والجهات الصديقة',
                    icon: 'pi pi-fw pi-shield',
                    routerLink: ['/discover/ourSidesCasualties']
                }
            ]
        }
    ];
}
