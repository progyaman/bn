import {Component, ElementRef, HostListener, ViewChild, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Router} from '@angular/router';
import {AppMenuitem} from './app.menuitem';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator && item.label !== 'إضافة حدث'" [item]="item" [index]="i" [root]="true"></li>
                
                <li *ngIf="item.label === 'إضافة حدث'" class="layout-root-menuitem relative">
                    <div class="flex items-center gap-6">
                        <!-- Mega Menu Trigger -->
                        <div #triggerBtn class="relative flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-300 select-none"
                             (click)="toggleMegaMenu()" (mouseenter)="openMegaMenu()" (mouseleave)="closeMegaMenu()">
                            
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <i class="pi pi-plus-circle text-primary text-xl"></i>
                                </div>
                                <span class="text-xl w-25 font-bold bg-gradient-to-l from-primary to-primary-600 bg-clip-text text-transparent">إضافة حدث</span>
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
    `]
})

export class AppMenu {
    @ViewChild('triggerBtn') triggerBtn!: ElementRef;
    
    isMegaMenuOpen = false;
    isLocked = false;
    menuPosition = {};
    private closeTimeout: any;
    
    eventTypes = [
        { label: 'نشاط أمني', description: 'توثيق الأنشطة والعمليات الأمنية الميدانية والمهمات الخاصة', icon: 'pi pi-shield', color: '#ffc107' },
        { label: 'تقرير موضوعي', description: 'تقييم شامل لموضوع محدد مع التحليل والتوصيات', icon: 'pi pi-file-edit', color: '#03a9f4' },
        { label: 'تقرير جزئي', description: 'تحديثات سريعة وتقارير مختصرة عن حالة معينة', icon: 'pi pi-list', color: '#4caf50' },
        { label: 'برقية', description: 'إبلاغ سريع عن حدث طارئ أو معلومة فورية', icon: 'pi pi-send', color: '#f44336' },
        { label: ' حدث امني', description: 'توثيق رسمي للافتادات ووقائع التحقيق والمحاضر', icon: 'pi pi-user-edit', color: '#9c27b0' },
        { label: 'اخبار عاجلة', description: 'سجلات الدورات، الممارسة الميدانية، والتدريب المشترك', icon: 'pi pi-book', color: '#795548' },
        { label: ' دراسة', description: 'تعريف أهداف جديدة في النظام وتحديد المعالم', icon: 'pi pi-map-marker', color: '#607d8b' }
    ];

    constructor(private router: Router, private cd: ChangeDetectorRef) {}

    @HostListener('window:keydown.escape')
    onEscape() {
        this.closeAll();
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

    toggleMegaMenu() { 
        this.cancelClose();
        this.updateMenuPosition();
        
        if (this.isMegaMenuOpen && !this.isLocked) {
            // If already open via hover, lock it instead of closing
            this.isLocked = true;
        } else {
            // Standard toggle logic
            this.isMegaMenuOpen = !this.isMegaMenuOpen;
            this.isLocked = this.isMegaMenuOpen;
        }
        this.cd.detectChanges();
    }

    openMegaMenu() { 
        this.cancelClose();
        if (!this.isLocked) {
            this.updateMenuPosition();
            this.isMegaMenuOpen = true; 
            this.cd.detectChanges();
        }
    }

    scheduleClose() {
        if (this.isLocked) return;
        this.cancelClose();
        this.closeTimeout = setTimeout(() => {
            this.isMegaMenuOpen = false;
            this.cd.detectChanges();
        }, 200); 
    }

    cancelClose() {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = null;
        }
    }

    closeMegaMenu() { 
        this.scheduleClose();
    }

    closeAll() {
        this.cancelClose();
        this.isMegaMenuOpen = false;
        this.isLocked = false;
        this.cd.detectChanges();
    }

    selectEventType(type: any) {
        this.closeAll();
        this.router.navigate(['/apps/events/create'], { queryParams: { type: type.label } });
    }

    model: any[] = [
        {
            label: 'الإحصائيات',
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
            label: 'إضافة حدث',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/apps/events/create']
            
        },
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
        
        {separator: true},
        {
            label: 'الدراسات',
            icon: 'pi pi-fw pi-book',
            items: [
                {
                    label: 'إضافة دراسة',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/study/create']
                },
                {
                    label: 'قائمة الدراسات',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/study/list']
                }
            ]
        },
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
        },
        {
            label: 'الخرائط',
            icon: 'pi pi-fw pi-map',
            items: [
                {
                    label: 'استوديو الخارطة',
                    icon: 'pi pi-fw pi-compass',
                    routerLink: ['/map/studio']
                }
            ]
        },
        {
            label: 'التقارير',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'قائمة التقارير',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/report/list']
                },
                {
                    label: 'إضافة تقرير',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/report/create']
                },
                {
                    label: 'طباعة تقرير',
                    icon: 'pi pi-fw pi-print',
                    routerLink: ['/report/print']
                }
            ]
        },
        {
            label: 'موقف الوافدين',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'قائمة المواقف',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/positionOfArrivals/list']
                },
                {
                    label: 'إضافة موقف',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/positionOfArrivals/create']
                }
            ]
        }
        
    ];
}
