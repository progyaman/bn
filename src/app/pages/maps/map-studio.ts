import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

type ResourceLibrary = 'js' | 'css' | 'demo';

interface ResourceRef {
    readonly name: string;
    readonly library: ResourceLibrary;
    readonly charset?: string;
}

const LIBRARY_PATHS: Record<ResourceLibrary, string> = {
    js: 'assets/js',
    css: 'assets/css',
    demo: 'assets/demo'
};

const JS_RESOURCES: ResourceRef[] = [
    { name: 'leaflet.js', library: 'js', charset: 'UTF-8' },
    { name: 'proj4.js', library: 'js', charset: 'UTF-8' },
    { name: 'mgrs.min.js', library: 'js', charset: 'UTF-8' },
    { name: 'MarkerClusterGroup.js', library: 'js', charset: 'UTF-8' },
    { name: 'MarkerCluster.js', library: 'js', charset: 'UTF-8' },
    { name: 'MarkerOpacity.js', library: 'js', charset: 'UTF-8' },
    { name: 'DistanceGrid.js', library: 'js', charset: 'UTF-8' },
    { name: 'MarkerCluster.QuickHull.js', library: 'js', charset: 'UTF-8' },
    { name: 'MarkerCluster.Spiderfier.js', library: 'js', charset: 'UTF-8' },
    { name: 'MarkerClusterGroup.Refresh.js', library: 'js', charset: 'UTF-8' },
    { name: 'Control.FullScreen.js', library: 'js', charset: 'UTF-8' },
    { name: 'AliCoordinateView.js', library: 'js', charset: 'UTF-8' },
    { name: 'AliMarkersFiltering.js', library: 'js', charset: 'UTF-8' },
    { name: 'AliSideBar.js', library: 'js', charset: 'UTF-8' },
    { name: 'leaflet-measure-path.js', library: 'js', charset: 'UTF-8' },
    { name: 'leaflet-geoman.js', library: 'js', charset: 'UTF-8' },
    { name: 'leaflet-search.src.js', library: 'js', charset: 'UTF-8' },
    { name: 'Leaflet.LinearMeasurement.js', library: 'js', charset: 'UTF-8' },
    { name: 'select2.min.js', library: 'js', charset: 'UTF-8' },
    { name: 'leaflet.browser.print.js', library: 'js', charset: 'UTF-8' },
    { name: 'flatpickr.js', library: 'js', charset: 'UTF-8' },
    { name: 'flatpicker-locale-ar.js', library: 'js', charset: 'UTF-8' },
    { name: 'js/chart.js', library: 'demo' },
    { name: 'chartjs-plugin-labels.js', library: 'js', charset: 'UTF-8' },
    { name: 'L.switchBasemap.js', library: 'js', charset: 'UTF-8' },
    { name: 'autocomplete.min.js', library: 'js', charset: 'UTF-8' },
    { name: 'AliSearchBox.js', library: 'js', charset: 'UTF-8' }
];

const CSS_RESOURCES: ResourceRef[] = [
    { name: 'leaflet.css', library: 'css' },
    { name: 'MarkerCluster.Default.css', library: 'css' },
    { name: 'Control.FullScreen.css', library: 'css' },
    { name: 'AliCoordinateView.css', library: 'css' },
    { name: 'AliMarkersFiltering.css', library: 'css' },
    { name: 'AliSideBar.css', library: 'css' },
    { name: 'leaflet-measure-path.css', library: 'css' },
    { name: 'leaflet-geoman.css', library: 'css' },
    { name: 'leaflet-search.src.css', library: 'css' },
    { name: 'Leaflet.LinearMeasurement.css', library: 'css' },
    { name: 'select2.min.css', library: 'css' },
    { name: 'flatpickr.min.css', library: 'css' },
    { name: 'L.switchBasemap.css', library: 'css' },
    { name: 'autocomplete.min.css', library: 'css' },
    { name: 'AliSearchBox.css', library: 'css' }
];

declare global {
    interface Window {
        Chart?: any;
    }
}

@Component({
    selector: 'app-map-studio',
    standalone: true,
    imports: [CommonModule, RouterModule, CardModule],
    template: `
        <div class="map-studio" dir="rtl">
            <div class="map-studio__header">
                <div>
                    <p class="map-studio__title">الخارطة</p>
                    <p class="map-studio__subtitle">استوديو الخارطة</p>
                </div>
            </div>

            <ng-container *ngIf="hasMapAccess; else noAccess">
                <form id="newsForm" class="map-studio__form">
                    <div class="map-studio__grid">
                        <section class="map-studio__events">
                            <p class="map-studio__section-title">الأحداث</p>
                            <div class="map-studio__events-list">
                                <div *ngFor="let event of eventList" class="map-studio__event-card">
                                    {{ event }}
                                </div>
                            </div>
                        </section>

                        <section class="map-studio__canvas" id="mapStudioCanvas">
                            <div class="map-studio__canvas-hint">
                                مساحة الخارطة (سيتم ربطها بملف الاستوديو)
                            </div>
                        </section>

                        <section class="map-studio__analytics">
                            <p-card
                                *ngFor="let card of analyticsCards"
                                [header]="card.title"
                                styleClass="analytics-card"
                            >
                                <div class="analytics-card__placeholder">{{ card.placeholder }}</div>
                            </p-card>
                        </section>
                    </div>

                    <div class="map-studio__legacy-note">
                        <!-- legacy map content -->
                    </div>
                </form>
            </ng-container>

            <ng-template #noAccess>
                <p class="map-studio__access-denied">
                    لا تمتلك صلاحية عرض هذه الصفحة
                </p>
            </ng-template>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                width: 100%;
            }

            .map-studio {
                padding: 1.5rem;
            }

            .map-studio__header {
                margin-bottom: 1.5rem;
            }

            .map-studio__title {
                font-size: 1.75rem;
                font-weight: 600;
                margin: 0;
                color: var(--surface-900, #111827);
            }

            .map-studio__subtitle {
                margin: 0;
                color: var(--surface-500, #6b7280);
                font-size: 0.95rem;
            }

            .map-studio__grid {
                display: grid;
                gap: 1rem;
                grid-template-columns: repeat(12, minmax(0, 1fr));
            }

            .map-studio__events,
            .map-studio__canvas,
            .map-studio__analytics {
                background: var(--surface-900, #111827);
                border-radius: 1rem;
                padding: 1rem;
                color: #fff;
            }

            .map-studio__events {
                grid-column: span 12;
                min-height: 18rem;
            }

            .map-studio__events-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-top: 0.5rem;
            }

            .map-studio__event-card {
                background: rgba(255, 255, 255, 0.08);
                padding: 0.75rem;
                border-radius: 0.75rem;
            }

            .map-studio__canvas {
                grid-column: span 12;
                min-height: 26rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .map-studio__canvas-hint {
                text-align: center;
                color: var(--surface-200, #e5e7eb);
                font-weight: 500;
            }

            .map-studio__analytics {
                grid-column: span 12;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .analytics-card {
                background: var(--surface-800, #1f2933);
                color: #fff;
                border-radius: 1rem;
            }

            .analytics-card__placeholder {
                height: 6rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                color: var(--surface-200, #e5e7eb);
            }

            .map-studio__legacy-note {
                margin-top: 1rem;
                padding: 0.75rem 1rem;
                border-radius: 0.75rem;
                background: rgba(15, 23, 42, 0.85);
                color: var(--surface-300, #cbd5f5);
                font-size: 0.85rem;
            }

            .map-studio__access-denied {
                font-weight: 600;
                color: #be123c;
                background: rgba(190, 18, 60, 0.1);
                padding: 1rem;
                border-radius: 0.75rem;
            }

            @media (min-width: 1024px) {
                .map-studio__events {
                    grid-column: span 2;
                }

                .map-studio__canvas {
                    grid-column: span 7;
                }

                .map-studio__analytics {
                    grid-column: span 3;
                }
            }
        `
    ]
})
export class MapStudioPage implements OnInit {
    readonly hideFooter = true;
    hasMapAccess = true;
    readonly eventList = ['حدث تجريبي 1', 'حدث تجريبي 2', 'حدث تجريبي 3'];
    readonly analyticsCards = [
        { title: 'الأنشطة في المحافظات', placeholder: 'مخطط تجريبي' },
        { title: 'الأنشطة الاستخبارية', placeholder: 'مخطط تجريبي' },
        { title: 'أنشطة مصادر الجمع', placeholder: 'مخطط تجريبي' }
    ];

    constructor(
        private readonly renderer: Renderer2,
        @Inject(DOCUMENT) private readonly document: Document
    ) {}

    ngOnInit(): void {
        this.loadStyles();
        this.loadScripts().then(() => {
            this.configureChartDefaults();
            this.attachLegacyDomScript();
        });
    }

    private loadStyles(): void {
        CSS_RESOURCES.forEach((ref) => this.appendLink(ref));
    }

    private loadScripts(): Promise<void[]> {
        const promises = JS_RESOURCES.map((ref) => this.appendScript(ref));
        return Promise.all(promises);
    }

    private appendLink(ref: ResourceRef): void {
        const key = this.getResourceKey(ref);
        if (this.document.head.querySelector(`link[data-resource="${key}"]`)) {
            return;
        }

        const link = this.renderer.createElement('link');
        this.renderer.setAttribute(link, 'rel', 'stylesheet');
        this.renderer.setAttribute(link, 'href', this.resolvePath(ref));
        this.renderer.setAttribute(link, 'data-resource', key);
        this.renderer.appendChild(this.document.head, link);
    }

    private appendScript(ref: ResourceRef): Promise<void> {
        const key = this.getResourceKey(ref);
        if (this.document.head.querySelector(`script[data-resource="${key}"]`)) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const script = this.renderer.createElement('script');
            this.renderer.setAttribute(script, 'src', this.resolvePath(ref));
            this.renderer.setAttribute(script, 'data-resource', key);
            if (ref.charset) {
                this.renderer.setAttribute(script, 'charset', ref.charset);
            }

            script.onload = () => resolve();
            script.onerror = () => resolve();
            this.renderer.appendChild(this.document.head, script);
        });
    }

    private resolvePath(ref: ResourceRef): string {
        const base = LIBRARY_PATHS[ref.library] ?? 'assets';
        return `${base}/${ref.name}`;
    }

    private getResourceKey(ref: ResourceRef): string {
        return `${ref.library}/${ref.name}`;
    }

    private configureChartDefaults(): void {
        const chart = window.Chart;
        const defaults = chart?.defaults?.global;
        if (!chart || !defaults) {
            return;
        }

        defaults.plugins = defaults.plugins ?? {};
        defaults.plugins.labels = {
            render: 'value',
            fontSize: 12,
            fontStyle: 'bold',
            fontColor: '#F9C74F'
        };
        defaults.defaultFontFamily = 'Droid Arabic Kufi';
        defaults.defaultFontColor = 'white';
        defaults.defaultFontStyle = 'bold';
    }

    private attachLegacyDomScript(): void {
        const key = 'mapStudioLegacyInline';
        if (this.document.head.querySelector(`script[data-resource="${key}"]`)) {
            return;
        }

        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'data-resource', key);
        this.renderer.setProperty(
            script,
            'textContent',
            `
                document.addEventListener("DOMContentLoaded", function () {
                    // ... legacy map script (see original attachment)
                });
            `
        );
        this.renderer.appendChild(this.document.head, script);
    }
}
