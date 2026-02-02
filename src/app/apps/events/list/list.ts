import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { EventService, MilitaryActivity, Coordinate, UploadFile } from '../event.service';
import { MapService } from './map.service';

@Component({
    selector: 'app-events-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        DialogModule,
        BadgeModule,
        MultiSelectModule,
        SelectModule,
        DatePickerModule,
        CheckboxModule,
        DividerModule,
        TooltipModule,
        ConfirmDialogModule,
        ToastModule,
        ChartModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './list.html',
    styleUrls: ['./list.scss']
})
export class EventsList implements OnInit {
    events = signal<MilitaryActivity[]>([]);
    selectedEvents: MilitaryActivity[] = [];
    selectedEvent: MilitaryActivity | null = null;
    
    // Dialog states
    uploadDialog = false;
    transferDialog = false;
    auditingDialog = false;
    mapDialog = false;
    transferMultiDialog = false;
    
    // Selected data
    selectedMuId: number | null = null;
    currentPreview: UploadFile | null = null;
    auditingData: any = null;

    // Filters and Lookups
    activityTypes = [
        { label: 'انفجار', value: 'انفجار' },
        { label: 'إطلاق نار', value: 'إطلاق نار' },
        { label: 'اختطاف', value: 'اختطاف' },
        { label: 'اغتيال', value: 'اغتيال' }
    ];
    countries = [
        { label: 'العراق', value: 'العراق' },
        { label: 'سوريا', value: 'سوريا' },
        { label: 'ايران', value: 'ايران' }
    ];
    cities = [
        { label: 'بغداد', value: 'بغداد' },
        { label: 'نينوى', value: 'نينوى' },
        { label: 'البصرة', value: 'البصرة' },
        { label: 'الأنبار', value: 'الأنبار' }
    ];
    districts = [
        { label: 'الكرخ', value: 'الكرخ' },
        { label: 'الرصافة', value: 'الرصافة' }
    ];
    handDistricts = [
        { label: 'المنصور', value: 'المنصور' },
        { label: 'الكاظمية', value: 'الكاظمية' }
    ];
    managementUnits = [
        { label: 'الوحدة الإدارية 1', value: 1 },
        { label: 'الوحدة الإدارية 2', value: 2 }
    ];
    categories = ['بارز', 'مهم', 'مفيد', 'للأرشفة'];

    // Column Toggler
    cols = [
        { field: 'id', header: 'الرقم الأحصائي' },
        { field: 'date_time', header: 'وقت وتاريخ الحدث' },
        { field: 'source', header: 'مصدر الخبر' },
        { field: 'typeArms', header: 'نوع السلاح' },
        { field: 'symbol', header: 'الرمز' },
        { field: 'mission', header: 'اسم المهمة' },
        { field: 'activityType', header: 'نوع الحدث' },
        { field: 'the_news', header: 'الخبر' },
        { field: 'org', header: 'المنظمة' },
        { field: 'otherHands', header: 'الجهات المشاركة' },
        { field: 'holdingForce', header: 'الجهة الماسكة' },
        { field: 'typeOrgNames', header: 'نوع المنظمة' },
        { field: 'tripCode', header: 'رمز الرحلة' },
        { field: 'tripNumber', header: 'رقم الرحلة' },
        { field: 'airCraftType', header: 'نوع الطائرة' },
        { field: 'mode3', header: 'mode3' },
        { field: 'mode2', header: 'mode2' },
        { field: 'icao', header: 'icao' },
        { field: 'locationTakeOff', header: 'منطقة الأقلاع' },
        { field: 'file103Note', header: 'ملاحظات الحدث' },
        { field: 'targetJndis', header: 'ارتباط بالهدف' },
        { field: 'numberBook', header: 'رقم الكتاب' },
        { field: 'country', header: 'الدولة' },
        { field: 'city', header: 'المحافظة' },
        { field: 'district', header: 'القضاء' },
        { field: 'handDistrict', header: 'الناحية' },
        { field: 'neighbourhood', header: 'المنطقة' },
        { field: 'coordinates', header: 'الأحداثي الجغرافي' },
        { field: 'coordinateTypes', header: 'نوع الاحداثي الجغرافي' },
        { field: 'category', header: 'التصنيف' },
        { field: 'gisAuditing', header: 'GIS' },
        { field: 'auditing', header: 'التدقيق' },
        { field: 'analysisOpinion', header: 'رأي التحليل' },
        { field: 'completionText', header: 'نص الأستكمال' },
        { field: 'proposals', header: 'الملاحظات' },
        { field: 'addAuditingByUser', header: 'قييم بواسطة' },
        { field: 'mu_id', header: 'منشئ الخبر' },
        { field: 'nickName', header: 'الأضافة بواسطة' },
        { field: 'createDate', header: 'وقت وتاريخ الأضافة' }
    ];
    selectedColumns: any[] = [];

    constructor(
        private eventService: EventService,
        private mapService: MapService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadEvents();
        this.selectedColumns = this.cols;
    }

    loadEvents() {
        this.eventService.getEvents().subscribe(data => {
            this.events.set(data);
        });
    }

    // Role logic (Placeholder)
    can(role: string): boolean {
        // TODO: Integrate with AuthService
        // return this.authService.hasRole(role);
        return true; 
    }

    canEdit(event: MilitaryActivity): boolean {
        // JSF Logic: (loginController.current_user.jihadNumber == militaryactivity.jihadNumber) or role check
        return this.can('Militaryactivity Update') || this.can('File103 Update');
    }

    canDelete(event: MilitaryActivity): boolean {
        return this.can('Militaryactivity Delete') || this.can('File103 Delete');
    }

    isColVisible(field: string): boolean {
        return this.selectedColumns.some(col => col.field === field);
    }

    getCategoryClass(category?: string): string {
        switch (category) {
            case 'بارز': return 'qualified';
            case 'مهم': return 'new';
            case 'مفيد': return 'negotiation';
            case 'للأرشفة': return 'unqualified';
            default: return '';
        }
    }

    // Actions
    confirmDelete(event: MilitaryActivity) {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.eventService.deleteEvent(event.id).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'تم الحذف', detail: 'تم حذف الحدث بنجاح' });
                    this.loadEvents();
                });
            }
        });
    }

    exportExcel() {
        console.log('Exporting to Excel...');
        this.messageService.add({ severity: 'info', summary: 'Export', detail: 'جاري تصدير البيانات...' });
    }

    viewAttachments(event: MilitaryActivity) {
        this.selectedEvent = event;
        this.uploadDialog = true;
        this.currentPreview = null;
    }

    previewFile(file: UploadFile) {
        this.currentPreview = file;
    }

    isImage(path: string): boolean {
        const ext = path.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '');
    }

    viewResults(event: MilitaryActivity) {
        this.messageService.add({ severity: 'info', summary: 'Results', detail: 'عرض تفاصيل الجهات المشاركة' });
    }

    openTransfer(event: MilitaryActivity) {
        this.selectedEvent = event;
        this.transferDialog = true;
    }

    openTransferMulti() {
        this.messageService.add({ severity: 'info', summary: 'Bulk Transfer', detail: 'فتح نافذة ترحيل المجموعة' });
    }

    addTransfer() {
        if (this.selectedEvent && this.selectedMuId) {
            this.eventService.transferEvent(this.selectedEvent.id, this.selectedMuId).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'تم الترحيل', detail: 'تمت العملية بنجاح' });
                this.loadEvents();
            });
        }
    }

    removeTransfer(transfer: any) {
        this.messageService.add({ severity: 'warn', summary: 'حذف الترحيل', detail: 'سيتم حذف الترحيل لاحقاً' });
    }

    openAuditing(event: MilitaryActivity) {
        this.auditingData = { ...event };
        this.auditingDialog = true;
    }

    saveAuditing() {
        this.eventService.saveAuditing(this.auditingData).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'تم الحفظ', detail: 'تم حفظ التقييم بنجاح' });
            this.auditingDialog = false;
            this.loadEvents();
        });
    }

    openSeizure(event: MilitaryActivity) {
        this.messageService.add({ severity: 'info', summary: 'Seizure', detail: 'فتح نافذة المضبوطات' });
    }

    showStatsByAdditionArms() {
        this.messageService.add({ severity: 'info', summary: 'Stats', detail: 'عرض إحصائيات نوع السلاح' });
    }

    showStatsByOrganization() {
        this.messageService.add({ severity: 'info', summary: 'Stats', detail: 'عرض إحصائيات المنظمات' });
    }

    showMap(event: MilitaryActivity) {
        this.mapService.initializeMap('map');
        this.mapDialog = true;
    }
}

