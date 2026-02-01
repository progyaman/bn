import { Component, computed, effect, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DomHandler } from 'primeng/dom';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[app-menuitem]',
    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
    template: `
        <ng-container>
            <div *ngIf="root && item.visible !== false" class="layout-menuitem-root-text">
                {{ item.label }}
            </div>
            <a
                *ngIf="(!item.routerLink || item.items) && item.visible !== false"
                [attr.href]="item.url"
                (click)="item.megaMenu ? toggleMegaMenu() : itemClick($event)"
                (mouseenter)="item.megaMenu ? openMegaMenu() : onMouseEnter()"
                (mouseleave)="item.megaMenu ? closeMegaMenu() : null"
                [ngClass]="item.class"
                [attr.target]="item.target"
                tabindex="0"
                pRipple
                [pTooltip]="item.label"
                [tooltipDisabled]="!(!isSlim() && !isHorizontal() && root && !active)"
            >
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text label-small text-inherit">{{ item.label }}</span>
                <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>

                <!-- Mega Menu Dropdown -->
                <div *ngIf="item.megaMenu" class="mega-menu-dropdown"
                     [class.visible]="isMegaMenuOpen"
                     (mouseenter)="openMegaMenu()" (mouseleave)="closeMegaMenu()">
                    
                     <div class="mega-menu-content p-6">
                        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
                            
                            <!-- Big Card -->
                            <div class="mega-card bg-[#ffc107] hover:bg-[#ffb300] p-8 rounded-[28px] lg:row-span-2 flex flex-col justify-between group/card cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
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
                                     (click)="$event.stopPropagation(); selectEventType(type)">
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
            </a>
            <a
                *ngIf="item.routerLink && !item.items && item.visible !== false"
                (click)="itemClick($event)"
                (mouseenter)="onMouseEnter()"
                [ngClass]="item.class"
                [routerLink]="item.routerLink"
                routerLinkActive="active-route"
                [routerLinkActiveOptions]="
                    item.routerLinkActiveOptions || {
                        paths: 'exact',
                        queryParams: 'ignored',
                        matrixParams: 'ignored',
                        fragment: 'ignored'
                    }
                "
                [fragment]="item.fragment"
                [queryParamsHandling]="item.queryParamsHandling"
                [preserveFragment]="item.preserveFragment"
                [skipLocationChange]="item.skipLocationChange"
                [replaceUrl]="item.replaceUrl"
                [state]="item.state"
                [queryParams]="item.queryParams"
                [attr.target]="item.target"
                tabindex="0"
                pRipple
                [pTooltip]="item.label"
                [tooltipDisabled]="!(!isSlim() && !isHorizontal() && root)"
            >
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text label-small text-inherit">{{ item.label }}</span>
                <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
            </a>

            <ul #submenu class="layout-root-submenulist z-50!" *ngIf="item.items && item.visible !== false" [@children]="submenuAnimation" (@children.done)="onSubmenuAnimated($event)">
                <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
                    <li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child['badgeClass']"></li>
                </ng-template>
            </ul>
        </ng-container>
    `,
    animations: [
        trigger('children', [
            state(
                'collapsed',
                style({
                    height: '0'
                })
            ),
            state(
                'expanded',
                style({
                    height: '*'
                })
            ),
            state(
                'hidden',
                style({
                    display: 'none'
                })
            ),
            state(
                'visible',
                style({
                    display: 'block'
                })
            ),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    styles: [`
        .mega-menu-dropdown {
            position: absolute;
            top: 0;
            right: 100%;
            margin-right: 1rem;
            filter: drop-shadow(0 25px 50px -12px rgb(0 0 0 / 0.15));
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 2000;
        }
        .mega-menu-dropdown.visible {
            visibility: visible;
            opacity: 1;
        }
        .mega-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mega-menu-content {
            padding: 1.5rem;
            background: #f6f7fb;
            border-radius: 32px;
            border: 1px solid rgba(255,255,255,0.5);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            width: 800px;
        }
        :host-context(.dark) .mega-menu-content {
            background: var(--surface-950);
            border-color: rgba(255,255,255,0.05);
        }
    `]
})
export class AppMenuitem implements OnInit, OnDestroy {
    @Input() item: any;

    @Input() index!: number;

    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

    @Input() parentKey!: string;

    @ViewChild('submenu') submenu!: ElementRef;

    isMegaMenuOpen = false;

    eventTypes = [
        { label: 'نشاط أمني', description: 'توثيق الأنشطة والعمليات الأمنية الميدانية والمهمات الخاصة', icon: 'pi pi-shield', color: '#ffc107' },
        { label: 'تقرير موضوعي', description: 'تقييم شامل لموضوع محدد مع التحليل والتوصيات', icon: 'pi pi-file-edit', color: '#03a9f4' },
        { label: 'تقرير جزئي', description: 'تحديثات سريعة وتقارير مختصرة عن حالة ', icon: 'pi pi-list', color: '#4caf50' },
        { label: 'برقية إخبارية', description: 'إبلاغ سريع عن حدث طارئ أو معلومة فورية', icon: 'pi pi-send', color: '#f44336' },
        { label: 'محضر تحقيق', description: 'توثيق رسمي للحدث ووقائع التحقيق والمحاضر', icon: 'pi pi-user-edit', color: '#9c27b0' },
        { label: 'نشاط تدريبي', description: 'سجلات الدورات، الممارسة الميدانية، والتدريب المشترك', icon: 'pi pi-book', color: '#795548' },
        { label: 'إضافة هدف', description: 'تعريف أهداف جديدة في النظام وتحديد المعالم', icon: 'pi pi-map-marker', color: '#607d8b' }
    ];

    toggleMegaMenu() { this.isMegaMenuOpen = !this.isMegaMenuOpen; }
    openMegaMenu() { this.isMegaMenuOpen = true; }
    closeMegaMenu() { this.isMegaMenuOpen = false; }

    selectEventType(type: any) {
        this.isMegaMenuOpen = false;
        this.router.navigate(['/apps/events/create'], { queryParams: { type: type.label } });
    }

    @HostBinding('class.active-menuitem')
    get activeClass() {
        return this.active && !this.root;
    }

    active = false;

    menuSourceSubscription: Subscription;

    menuResetSubscription: Subscription;

    key: string = '';

    get submenuAnimation() {
        if (this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isCompact())) {
            return this.active ? 'visible' : 'hidden';
        } else return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
    }

    isSlim = computed(() => this.layoutService.isSlim());

    isCompact = computed(() => this.layoutService.isCompact());

    isHorizontal = computed(() => this.layoutService.isHorizontal());

    get isDesktop() {
        return this.layoutService.isDesktop();
    }

    get isMobile() {
        return this.layoutService.isMobile();
    }

    constructor(
        public layoutService: LayoutService,
        public router: Router
    ) {
        this.menuSourceSubscription = this.layoutService.menuSource$.subscribe((value) => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) {
                    this.active = value.key === this.key || value.key.startsWith(this.key + '-') ? true : false;
                } else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                        this.active = false;
                    }
                }
            });
        });

        this.menuResetSubscription = this.layoutService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((params) => {
            if (this.isCompact() || this.isSlim() || this.isHorizontal()) {
                this.active = false;
            } else {
                if (this.item.routerLink) {
                    this.updateActiveStateFromRoute();
                }
            }
        });

        effect(() => {
            if (this.layoutService.isOverlay() && this.layoutService.isSidebarActive()) {
                if (this.item.routerLink) {
                    this.updateActiveStateFromRoute();
                }
            }
        });
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

        if (!(this.isCompact() || this.isSlim() || this.isHorizontal()) && this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    ngAfterViewChecked() {
        if (this.root && this.active && this.isDesktop && (this.isHorizontal() || this.isSlim() || this.isCompact())) {
            this.calculatePosition(this.submenu?.nativeElement, this.submenu?.nativeElement.parentElement);
        }
    }

    updateActiveStateFromRoute() {
        if (this.item && this.item.routerLink) {
            let activeRoute = this.router.isActive(this.item.routerLink[0], {
                paths: 'exact',
                queryParams: 'ignored',
                matrixParams: 'ignored',
                fragment: 'ignored'
            });
            if (activeRoute) {
                this.layoutService.onMenuStateChange({
                    key: this.key,
                    routeEvent: true
                });
            }
        }
    }

    onSubmenuAnimated(event: AnimationEvent) {
        if (event.toState === 'visible' && this.isDesktop && (this.isHorizontal() || this.isSlim() || this.isCompact())) {
            const el = <HTMLUListElement>event.element;
            const elParent = <HTMLUListElement>el.parentElement;
            this.calculatePosition(el, elParent);
        }
    }

    calculatePosition(overlay: HTMLElement, target: HTMLElement) {
        if (overlay) {
            const { left, top } = target.getBoundingClientRect();
            const [vWidth, vHeight] = [window.innerWidth, window.innerHeight];
            const [oWidth, oHeight] = [overlay.offsetWidth, overlay.offsetHeight];
            const scrollbarWidth = DomHandler.calculateScrollbarWidth();
            // reset
            overlay.style.top = '';
            overlay.style.left = '';

            if (this.layoutService.isHorizontal()) {
                const width = left + oWidth + scrollbarWidth;
                overlay.style.left = vWidth < width ? `${left - (width - vWidth)}px` : `${left}px`;
            } else if (this.layoutService.isSlim() || this.layoutService.isCompact()) {
                const height = top + oHeight;
                overlay.style.top = vHeight < height ? `${top - (height - vHeight)}px` : `${top}px`;
            }
        }
    }

    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // navigate with hover
        if ((this.root && this.isSlim()) || this.isHorizontal() || this.isCompact()) {
            this.layoutService.layoutState.update((val) => ({
                ...val,
                menuHoverActive: !val.menuHoverActive
            }));
        }

        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;

            if (this.root && this.active && (this.isSlim() || this.isHorizontal() || this.isCompact())) {
                this.layoutService.onOverlaySubmenuOpen();
            }
        } else {
            if (this.layoutService.isMobile()) {
                this.layoutService.layoutState.update((val) => ({
                    ...val,
                    staticMenuMobileActive: false
                }));
            }

            if (this.isSlim() || this.isHorizontal() || this.isCompact()) {
                this.layoutService.reset();
                this.layoutService.layoutState.update((val) => ({
                    ...val,
                    menuHoverActive: false
                }));
            }
        }

        this.layoutService.onMenuStateChange({ key: this.key });
    }

    onMouseEnter() {
        // activate item on hover
        if (this.root && (this.isSlim() || this.isHorizontal() || this.isCompact()) && this.layoutService.isDesktop()) {
            if (this.layoutService.layoutState().menuHoverActive) {
                this.active = true;
                this.layoutService.onMenuStateChange({ key: this.key });
            }
        }
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }

        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
}
