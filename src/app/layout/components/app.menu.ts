import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppMenuitem} from './app.menuitem';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})

export class AppMenu {
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
        },
        {
            label: 'الإعدادات',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: 'نوع النشاط',
                    icon: 'pi pi-fw pi-tags',
                    routerLink: ['/settings/activitytype']
                },
                {
                    label: 'نوع الرصد',
                    icon: 'pi pi-fw pi-compass',
                    routerLink: ['/settings/aircrafttype']
                },
                {
                    label: 'المضبوطات',
                    icon: 'pi pi-fw pi-inbox',
                    routerLink: ['/settings/category']
                },
                {
                    label: 'الأحداثي الجغرافي',
                    icon: 'pi pi-fw pi-map-marker',
                    routerLink: ['/settings/coordinate']
                },
                {
                    label: 'نوع الاحداثي الجغرافي',
                    icon: 'pi pi-fw pi-compass',
                    routerLink: ['/settings/coordinate_type']
                },
                {
                    label: 'الدولة',
                    icon: 'pi pi-fw pi-flag',
                    routerLink: ['/settings/country']
                },
                {
                    label: 'المحافظة',
                    icon: 'pi pi-fw pi-building',
                    routerLink: ['/settings/city']
                },
                {
                    label: 'القضاء',
                    icon: 'pi pi-fw pi-sitemap',
                    routerLink: ['/settings/district']
                },
                {
                    label: 'الناحية',
                    icon: 'pi pi-fw pi-map',
                    routerLink: ['/settings/handdistrict']
                },
                {
                    label: 'التبعية',
                    icon: 'pi pi-fw pi-link',
                    routerLink: ['/settings/dependency']
                },
                {
                    label: 'المصير',
                    icon: 'pi pi-fw pi-directions',
                    routerLink: ['/settings/destinySeizure']
                },
                {
                    label: 'موقع الأقلاع',
                    icon: 'pi pi-fw pi-map-marker',
                    routerLink: ['/settings/locationTakeOff']
                },
                {
                    label: 'المهمة او العملية',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/settings/mission']
                },
                {
                    label: 'الاستيراد',
                    icon: 'pi pi-fw pi-download',
                    routerLink: ['/settings/import_export']
                },
                {
                    label: 'الاسم او الرمز',
                    icon: 'pi pi-fw pi-hashtag',
                    routerLink: ['/settings/nameOrSymbol']
                },
                {
                    label: 'المرصد',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/settings/observatory']
                },
                {
                    label: 'التنظيم',
                    icon: 'pi pi-fw pi-building',
                    routerLink: ['/settings/orgName']
                },
                {
                    label: 'اورك',
                    icon: 'pi pi-fw pi-sitemap',
                    routerLink: ['/settings/org']
                },
                {
                    label: 'جهات اخرى',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/settings/otherhand']
                },
                {
                    label: 'ملف امني',
                    icon: 'pi pi-fw pi-shield',
                    routerLink: ['/settings/securityFile']
                },
                {
                    label: 'مصدر',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/settings/source']
                },
                {
                    label: 'نوع ارمي',
                    icon: 'pi pi-fw pi-th-large',
                    routerLink: ['/settings/typeArms']
                },
                {
                    label: 'نوع التنظيم',
                    icon: 'pi pi-fw pi-building',
                    routerLink: ['/settings/typeOrgName']
                },
                {
                    label: 'نوع المضبوطات',
                    icon: 'pi pi-fw pi-inbox',
                    routerLink: ['/settings/typeSeizure']
                }
            ]
        }
        
    ];
}
