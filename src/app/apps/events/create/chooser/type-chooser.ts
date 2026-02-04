import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-type-chooser',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './type-chooser.html',
    styleUrls: ['./type-chooser.scss']
})
export class TypeChooser {
    eventTypes = [
        { label: 'نشاط أمني', description: 'توثيق الأنشطة والعمليات الأمنية الميدانية والمهمات الخاصة', icon: 'pi pi-shield', color: '#ffc107' },
        { label: 'تقرير موضوعي', description: 'تقييم شامل لموضوع محدد مع التحليل والتوصيات', icon: 'pi pi-file-edit', color: '#03a9f4' },
        { label: 'تقرير جزئي', description: 'تحديثات سريعة وتقارير مختصرة عن حالة معينة', icon: 'pi pi-list', color: '#4caf50' },
        { label: 'برقية', description: 'إبلاغ سريع عن حدث طارئ أو معلومة فورية', icon: 'pi pi-send', color: '#f44336' },
        { label: 'حدث أمني', description: 'توثيق رسمي للافتادات ووقائع التحقيق والمحاضر', icon: 'pi pi-user-edit', color: '#9c27b0' },
        { label: 'أخبار عاجلة', description: 'سجلات الدورات، الممارسة الميدانية، والتدريب المشترك', icon: 'pi pi-bolt', color: '#795548' },
        { label: 'دراسة', description: 'تعريف أهداف جديدة في النظام وتحديد المعالم', icon: 'pi pi-book', color: '#607d8b' }
    ];

    pinnedType: string | null = null;
    hoveredType: string | null = null;

    detailsMap: any = {
        'نشاط أمني': {
            title: 'نشاط أمني',
            description: 'توثيق دقيق لكافة الأنشطة الميدانية والمهمات الخاصة والعمليات الأمنية المنفذة في نطاق المسؤولية.',
            icon: 'pi pi-shield',
            color: '#f7b500',
            points: [
                { text: 'تسجيل توقيت ومكان النشاط بدقة', icon: 'pi pi-clock' },
                { text: 'ربط النشاط بالقوات الميدانية المشاركة', icon: 'pi pi-users' },
                { text: 'إرفاق تقارير تقنية وصور ميدانية', icon: 'pi pi-camera' }
            ]
        },
        'تقرير موضوعي': {
            title: 'تقرير موضوعي',
            description: 'تحليل معمق وشامل لموضوع أمني محدد يتضمن المعطيات المتاحة، التحديات والمخاطر، والتوصيات المقترحة.',
            icon: 'pi pi-file-edit',
            color: '#03a9f4',
            points: [
                { text: 'هيكلية منظمة للفقرات والتحليلات', icon: 'pi pi-align-right' },
                { text: 'استعراض الأدلة والقرائن المرتبطة', icon: 'pi pi-search-plus' },
                { text: 'توصيات استشرافية مبنية على مؤشرات', icon: 'pi pi-lightbulb' }
            ]
        },
        'تقرير جزئي': {
            title: 'تقرير جزئي',
            description: 'تحديثات سريعة وموجزة عن أحداث جارية أو معلومات أولية تتطلب توثيقاً فورياً ومتابعة لاحقة.',
            icon: 'pi pi-list',
            color: '#4caf50',
            points: [
                { text: 'سرعة التوثيق والمشاركة الفورية', icon: 'pi pi-bolt' },
                { text: 'إمكانية التحويل لتقرير موضوعي لاحقاً', icon: 'pi pi-refresh' },
                { text: 'تنبيهات آلية للمتابعين المعنيين', icon: 'pi pi-bell' }
            ]
        },
        'برقية': {
            title: 'برقية عاجلة',
            description: 'نظام مراسلة فوري مخصص للبلاغات الطارئة التي تتطلب تدخلًا قياديًا مباشرًا وتنسيقًا أمنيًا عالي المستوى.',
            icon: 'pi pi-send',
            color: '#ef4444',
            points: [
                { text: 'إرسال فوري للغرف العملياتية', icon: 'pi pi-bolt' },
                { text: 'تتبع حالة الاستلام والرد', icon: 'pi pi-check-circle' },
                { text: 'أرشفة أمنية مشفرة برقم وتاريخ', icon: 'pi pi-lock' }
            ]
        },
        'حدث أمني': {
            title: 'حدث أمني',
            description: 'توثيق رسمي للوقائع والتحقيقات والمحاضر المرتبطة بالاختراقات أو الحوادث الأمنية داخل النطاق.',
            icon: 'pi pi-user-edit',
            color: '#9c27b0',
            points: [
                { text: 'أرشفة المحاضر والشهادات الرسمية', icon: 'pi pi-folder' },
                { text: 'ربط الأشخاص المتورطين والشهود', icon: 'pi pi-users' },
                { text: 'تتبع المسار القانوني والإجرائي للحدث', icon: 'pi pi-briefcase' }
            ]
        },
        'أخبار عاجلة': {
            title: 'أخبار عاجلة',
            description: 'توثيق حي ومستمر للمستجدات الميدانية والنشاطات الأمنية اللحظية لضمان تدفق المعلومات للقادة.',
            icon: 'pi pi-bolt',
            color: '#f59e0b',
            points: [
                { text: 'تغطية ميدانية شاملة وبث حي', icon: 'pi pi-map' },
                { text: 'تحديثات دورية كل 15 دقيقة', icon: 'pi pi-sync' },
                { text: 'إشعارات ذكية للأجهزة المحمولة', icon: 'pi pi-bell' }
            ]
        },
        'دراسة': {
            title: 'دراسة استراتيجية',
            description: 'أداة تحليلية متقدمة لتقييم الأهداف الاستراتيجية، والمعالم الجغرافية، والتهديدات بناءً على معطيات دقيقة.',
            icon: 'pi pi-book',
            color: '#6366f1',
            points: [
                { text: 'رسم خرائط حرارية للتهديدات', icon: 'pi pi-map-marker' },
                { text: 'تقييم المخاطر وتوقعات مستقبلية', icon: 'pi pi-shield' },
                { text: 'تكامل مع قواعد بيانات الأهداف', icon: 'pi pi-database' }
            ]
        }
    };

    get activeDetails(): any {
        const type = this.pinnedType || this.hoveredType;
        return type ? this.detailsMap[type] : null;
    }

    constructor(private router: Router) {}

    onMouseEnter(type: string) {
        // Hover only works if nothing is pinned, or as a preview
        if (!this.pinnedType) {
            this.hoveredType = type;
        }
    }

    onMouseLeave() {
        this.hoveredType = null;
    }

    /**
     * Optimized Click Handler
     * event.detail === 1: Single Click (Immediate Pin + Details)
     * event.detail === 2: Double Click (Immediate Navigation)
     */
    onCardClick(event: MouseEvent, type: string) {
        // Prevent default browser behavior that might interfere
        event.stopPropagation();

        if (event.detail === 1) {
            // SINGLE CLICK: Instant feedback
            if (this.pinnedType === type) {
                this.pinnedType = null; // Toggle Unpin
            } else {
                this.pinnedType = type;
                this.hoveredType = null;
            }
        } 
        else if (event.detail >= 2) {
            // DOUBLE CLICK: Instant navigation
            // We ensure navigation happens immediately on the second click
            this.selectType(type);
        }
    }

    selectType(type: string) {
        this.router.navigate(['/apps/events/create'], { queryParams: { type: type } });
    }
}
