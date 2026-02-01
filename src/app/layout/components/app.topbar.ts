import {Component, computed, ElementRef, inject, model, signal, ViewChild} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {StyleClassModule} from 'primeng/styleclass';
import {LayoutService} from '@/layout/service/layout.service';
import {AppBreadcrumb} from './app.breadcrumb';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {RippleModule} from 'primeng/ripple';
import {BadgeModule} from 'primeng/badge';
import {OverlayBadgeModule} from 'primeng/overlaybadge';
import {AvatarModule} from 'primeng/avatar';
import {FormsModule} from "@angular/forms";
import {AuthService} from '@/auth/auth.service';
import {Router} from '@angular/router';
import {AppMenu} from './app.menu';

interface NotificationsBars {
    id: string;
    label: string;
    badge?: string | any;
}

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule, StyleClassModule, AppBreadcrumb, InputTextModule, ButtonModule, IconFieldModule, InputIconModule, RippleModule, BadgeModule, OverlayBadgeModule, AvatarModule, AppMenu],
    template: `
        <div class="layout-topbar">
            <div class="topbar-left">
                <a tabindex="0" #menubutton type="button" class="menu-button" (click)="onMenuButtonClick()">
                    <i class="pi pi-chevron-left"></i>
                </a>
                <img class="horizontal-logo" src="/images/app/bn.png" alt="bn" style="height: 2.5rem;"/>
                
                <div class="hidden lg:block ml-4" *ngIf="layoutService.isHorizontal()">
                    <div app-menu></div>
                </div>

                <span class="topbar-separator"></span>
                <div app-breadcrumb></div>
                <a routerLink="/">
                    <img class="mobile-logo" src="/images/app/bn.png" alt="bn"/>
                </a>
            </div>

            <div class="topbar-right">
                <ul class="topbar-menu">
                    <!--
                    <li class="right-sidebar-item">
                        <a class="right-sidebar-button" (click)="toggleSearchBar()">
                            <i class="pi pi-search"></i>
                        </a>
                    </li> -->
                    <li class="right-sidebar-item">
                        <button class="app-config-button" (click)="onConfigButtonClick()"><i class="pi pi-cog"></i>
                        </button>
                    </li>
                    
                    <li class="profile-item static sm:relative">
                        <div class="flex items-center gap-3">
                            <button class="layout-sidebar-anchor z-2" type="button" (click)="anchor()"></button>
                            
                            <div class="relative">
                                <!-- Trigger: Logo + Username -->
                                <a class="flex items-center gap-3 p-1 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200 cursor-pointer border border-transparent"
                                   pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" 
                                   leaveActiveClass="animate-fadeout" leaveToClass="hidden" [hideOnOutsideClick]="true">
                                    <img class="w-10 h-10 rounded-lg shadow-sm object-cover" src="/images/app/bn.png" alt="bn" />
                                    <div class="hidden sm:flex flex-col items-start px-1">
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0 leading-none" *ngIf="auth.userName()">{{ auth.userName() }}</span>
                                        <span class="text-[10px] text-surface-500 font-semibold uppercase mt-1">الحساب النشط</span>
                                    </div>
                                    <i class="pi pi-chevron-down text-[10px] text-surface-400"></i>
                                </a>

                                <!-- Enhanced Dropdown Menu -->
                                <div class="absolute top-full left-0 mt-3 w-64 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-2xl hidden z-50 origin-top-left overflow-hidden">
                                    <ul class="list-none m-0 p-2 flex flex-col gap-1">
                                        <!-- User Header Info -->
                                        <li class="p-3 mb-1 border-b border-surface-100 dark:border-surface-800 hidden md:block">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                                                    <i class="pi pi-user text-primary"></i>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-surface-900 dark:text-surface-0">{{ auth.userName() }}</span>
                                                    <span class="text-xs text-surface-500">متصل الآن</span>
                                                </div>
                                            </div>
                                        </li>
                                        <!-- Actions -->
                                        <li>
                                            <a routerLink="/profile" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200 group">
                                                <div class="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 transition-colors">
                                                    <i class="pi pi-users text-sm group-hover:text-primary"></i>
                                                </div>
                                                <span class="font-medium text-sm">إدارة المستخدمين</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a (click)="onLogout()" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 cursor-pointer group">
                                                <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
                                                    <i class="pi pi-power-off text-sm"></i>
                                                </div>
                                                <span class="font-medium text-sm">تسجيل الخروج</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                    <!-- <li class="right-sidebar-item">
                        <a tabindex="0" class="right-sidebar-button" (click)="showRightMenu()">
                            <i class="pi pi-align-right"></i>
                        </a>
                    </li> -->
                </ul>
            </div>
        </div>`
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    public readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    @ViewChild('menubutton') menuButton!: ElementRef;

    notificationSearch = '';

    notificationsBars = signal<NotificationsBars[]>([
        {
            id: 'inbox',
            label: 'Inbox',
            badge: '2'
        },
        {
            id: 'general',
            label: 'General'
        },
        {
            id: 'archived',
            label: 'Archived'
        }
    ]);

    notifications = signal<any[]>([
        {
            id: 'inbox',
            data: [
                {
                    image: '/demo/images/avatar/avatar-square-m-2.jpg',
                    name: 'Michael Lee',
                    description: 'You have a new message from the support team regarding your recent inquiry.',
                    time: '1 hour ago',
                    attachment: {
                        title: 'Contract',
                        size: '2.1 MB'
                    },
                    read: false
                },
                {
                    image: '/demo/images/avatar/avatar-square-f-1.jpg',
                    name: 'Alice Johnson',
                    description: 'Your report has been successfully submitted and is under review.',
                    time: '10 minutes ago',
                    read: true
                },
                {
                    image: '/demo/images/avatar/avatar-square-f-2.jpg',
                    name: 'Emily Davis',
                    description: 'The project deadline has been updated to September 30th. Please check the details.',
                    time: 'Yesterday at 4:35 PM',
                    read: false
                }
            ]
        },
        {
            id: 'general',
            data: [
                {
                    image: '/demo/images/avatar/avatar-square-f-1.jpg',
                    name: 'Alice Johnson',
                    description: 'Reminder: Your subscription is about to expire in 3 days. Renew now to avoid interruption.',
                    time: '30 minutes ago',
                    read: true
                },
                {
                    image: '/demo/images/avatar/avatar-square-m-2.jpg',
                    name: 'Michael Lee',
                    description: 'The server maintenance has been completed successfully. No further downtime is expected.',
                    time: 'Yesterday at 2:15 PM',
                    read: false
                }
            ]
        },
        {
            id: 'archived',
            data: [
                {
                    image: '/demo/images/avatar/avatar-square-m-1.jpg',
                    name: 'Lucas Brown',
                    description: 'Your appointment with Dr. Anderson has been confirmed for October 12th at 10:00 AM.',
                    time: '1 week ago',
                    read: false
                },
                {
                    image: '/demo/images/avatar/avatar-square-f-2.jpg',
                    name: 'Emily Davis',
                    description: 'The document you uploaded has been successfully archived for future reference.',
                    time: '2 weeks ago',
                    read: true
                }
            ]
        }
    ]);

    selectedNotificationBar = model(this.notificationsBars()[0].id ?? 'inbox');

    selectedNotificationsBarData = computed(() => this.notifications().find((f) => f.id === this.selectedNotificationBar()).data);

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    showRightMenu() {
        this.layoutService.toggleRightMenu();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    toggleSearchBar() {
        this.layoutService.layoutState.update((value) => ({...value, searchBarActive: !value.searchBarActive}));
    }

    onLogout() {
        this.auth.logout();
        this.router.navigateByUrl('/login');
    }

    anchor() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            anchored: !state.anchored
        }));
    }
}
