import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { File103ActivitySection, File103ActivityModel } from './components/file103-activity-section';
import { File103LocationModel, File103LocationSection } from './components/file103-location-section';
import { File103MediaItem, File103MediaSection } from './components/file103-media-section';
import { CoordinateDialog } from './components/coordinate-dialog';
import { TypeOrgDialog } from './components/typeorg-dialog';

@Component({
    selector: 'app-file103-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DividerModule,
        ToastModule,
        File103ActivitySection,
        File103LocationSection,
        File103MediaSection,
        CoordinateDialog,
        TypeOrgDialog
    ],
    providers: [MessageService],
    template: `
        <div dir="rtl">
            <p-toast />

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0">إنشاء رصد جوي</div>
                    <div class="text-sm text-surface-600 dark:text-surface-300">ملف 103</div>
                </div>
                <div class="flex gap-2">
                    <p-button type="button" label="حفظ" icon="pi pi-save" (onClick)="save()" />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12">
                    <app-file103-activity-section [model]="activity" (openTypeOrgDialog)="typeOrgVisible.set(true)" />
                </div>

                <div class="col-span-12">
                    <app-file103-location-section
                        [model]="location"
                        (addCoordinateClick)="coordinateVisible.set(true)"
                        (smartAssistClick)="smartAssist()"
                    />
                </div>

                <div class="col-span-12">
                    <app-file103-media-section [items]="media()" (uploadClick)="fakeUpload()" (remove)="removeMedia($event)" />
                </div>
            </div>

            <p-divider />

            <app-coordinate-dialog
                [visible]="coordinateVisible()"
                (visibleChange)="coordinateVisible.set($event)"
                (saved)="onCoordinateSaved($event)"
            />

            <app-typeorg-dialog
                [visible]="typeOrgVisible()"
                (visibleChange)="typeOrgVisible.set($event)"
                (saved)="onTypeOrgSaved($event)"
            />
        </div>
    `
})
export class File103CreatePage {
    activity: File103ActivityModel = {
        date: null,
        time: null,
        durationHours: null,
        organization: null,
        typeOrgNames: [],
        tripCode: '',
        tripNumber: '',
        airCraftType: null,
        mode3: '',
        mode2: '',
        icao: '',
        locationTakeOff: null
    };

    location: File103LocationModel = {
        country: null,
        city: null,
        neighbourhood: '',
        coordinates: [],
        theNews: '',
        note: ''
    };

    coordinateVisible = signal(false);
    typeOrgVisible = signal(false);

    media = signal<File103MediaItem[]>([]);

    constructor(private messageService: MessageService) {}

    save() {
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم الحفظ (تجريبي)' });
    }

    fakeUpload() {
        const now = new Date();
        const newItem: File103MediaItem = {
            id: `${now.getTime()}`,
            name: `attachment_${now.getTime()}.pdf`,
            size: 1024 * (1 + Math.floor(Math.random() * 500)),
            createdAt: now
        };
        this.media.update((items) => [newItem, ...items]);
        this.messageService.add({ severity: 'info', summary: 'مرفق', detail: 'تمت إضافة مرفق تجريبي' });
    }

    removeMedia(id: string) {
        this.media.update((items) => items.filter((x) => x.id !== id));
        this.messageService.add({ severity: 'warn', summary: 'حذف', detail: 'تم حذف المرفق' });
    }

    onCoordinateSaved(coord: { name: string; type: { name: string } | null }) {
        const typeLabel = coord.type?.name ? ` (${coord.type.name})` : '';
        const label = `${coord.name}${typeLabel}`;
        const coordinates = this.location.coordinates ?? [];
        this.location.coordinates = [...coordinates, label];
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الأحداثي' });
    }

    onTypeOrgSaved(typeOrgName: string) {
        const current = this.activity.typeOrgNames ?? [];
        this.activity.typeOrgNames = [...current, typeOrgName];
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة نوع النشاط' });
    }

    smartAssist() {
        const country = this.location.country ?? '';
        const city = this.location.city ?? '';
        const neighbourhood = this.location.neighbourhood ?? '';
        const coords = (this.location.coordinates ?? []).join('، ');
        const date = this.activity.date ? new Date(this.activity.date).toLocaleDateString('ar') : '';

        const parts = [
            country && `الدولة: ${country}`,
            city && `المحافظة: ${city}`,
            neighbourhood && `المنطقة: ${neighbourhood}`,
            coords && `الإحداثيات: ${coords}`,
            date && `التاريخ: ${date}`
        ].filter(Boolean);

        this.location.theNews = parts.length ? parts.join(' | ') : 'يرجى إدخال بيانات الموقع أولاً.';
    }
}
