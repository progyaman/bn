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
import { EventService, MilitaryActivity, Coordinate, UploadFile } from './event.service';
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
    template: `
        <div class="p-grid crud" dir="rtl">
            <div class="p-col-12">
                <div *ngIf="can('Militaryactivity View') || can('File103 View')" class="card">
                    <p-toast></p-toast>

                    <p-table
                        #dt
                        [value]="events()"
                        [(selection)]="selectedEvents"
                        [rows]="20"
                        [paginator]="true"
                        [rowsPerPageOptions]="[20, 50, 100]"
                        [rowHover]="true"
                        dataKey="id"
                        currentPageReportTemplate="المجموع : {totalRecords}"
                        [showCurrentPageReport]="true"
                        styleClass="pro-table p-datatable-sm p-datatable-gridlines p-datatable-striped"
                        [lazy]="false"
                        [scrollable]="true"
                        scrollHeight="700px"
                    >
                        <ng-template pTemplate="caption">
                            <div class="table-toolbar">
                                <div class="toolbar-start">
                                    <p-button 
                                        *ngIf="can('ExportActivityAuditPerm View')" 
                                        label="تصدير الأحداث" 
                                        icon="pi pi-file-excel" 
                                        severity="secondary" 
                                        (onClick)="exportExcel()" />
                                    
                                    <p-button 
                                        *ngIf="can('Transfer View')"
                                        [label]="'ترحيل ' + (selectedEvents.length || 0)" 
                                        icon="pi pi-send" 
                                        severity="success" 
                                        [disabled]="!selectedEvents || selectedEvents.length === 0"
                                        (onClick)="openTransferMulti()" />
                                </div>
                                <div class="toolbar-end">
                                    <p-multiSelect 
                                        [options]="cols" 
                                        [(ngModel)]="selectedColumns" 
                                        optionLabel="header"
                                        selectedItemsLabel="{0} أعمدة مختارة" 
                                        [style]="{minWidth: '220px'}" 
                                        placeholder="اختيار الأعمدة" />
                                    
                                    <p-button icon="pi pi-chart-pie" severity="info" (onClick)="showStatsByAdditionArms()" pTooltip="نسبة مشاركة برفع الأحداث" label="إحصائيات" />
                                    <p-button icon="pi pi-chart-bar" severity="help" (onClick)="showStatsByOrganization()" pTooltip="نسبة مشاركة المنظمات" />
                                </div>
                            </div>
                        </ng-template>

                        <ng-template pTemplate="header">
                            <tr>
                                <th class="select-col">
                                    <p-tableHeaderCheckbox />
                                </th>
                                <th class="action-col">تعديل</th>
                                <th class="action-col">حذف</th>
                                <th class="action-col">مرفقات</th>
                                <th class="action-col">الجهات</th>
                                <th class="action-col">ترحيل</th>
                                <th class="action-col">تقييم</th>
                                <th class="action-col">مضبوطات</th>
                                <th *ngIf="isColVisible('id')" pSortableColumn="id" style="width: 100px; min-width: 100px;">الرقم الأحصائي <p-sortIcon field="id" /></th>
                                <th *ngIf="isColVisible('date_time')" pSortableColumn="date_time" style="width: 160px; min-width: 160px;">وقت وتاريخ الحدث <p-sortIcon field="date_time" /></th>
                                <th *ngIf="isColVisible('source')" style="width: 200px; min-width: 200px;">مصدر الخبر</th>
                                <th *ngIf="isColVisible('typeArms')" style="width: 160px; min-width: 160px;">نوع السلاح/الإضافة</th>
                                <th *ngIf="isColVisible('symbol')" style="width: 160px; min-width: 160px;">الرمز</th>
                                <th *ngIf="isColVisible('mission')" style="width: 230px; min-width: 230px;">اسم المهمة</th>
                                <th *ngIf="isColVisible('activityType')" style="width: 140px; min-width: 140px;">نوع الحدث</th>
                                <th *ngIf="isColVisible('the_news')" style="width: 500px; min-width: 500px;">الخبر</th>
                                <th *ngIf="isColVisible('org')" style="width: 160px; min-width: 160px;">المنظمة</th>
                                <th *ngIf="isColVisible('otherHands')" style="width: 160px; min-width: 160px;">الجهات المشاركة</th>
                                <th *ngIf="isColVisible('holdingForce')" style="width: 160px; min-width: 160px;">الجهة الماسكة</th>
                                <th *ngIf="isColVisible('typeOrgNames')" style="width: 250px; min-width: 250px;">نوع المنظمة</th>
                                <th *ngIf="isColVisible('tripCode')" style="width: 130px; min-width: 130px;">رمز الرحلة</th>
                                <th *ngIf="isColVisible('tripNumber')" style="width: 130px; min-width: 130px;">رقم الرحلة</th>
                                <th *ngIf="isColVisible('airCraftType')" style="width: 150px; min-width: 150px;">نوع الطائرة</th>
                                <th *ngIf="isColVisible('mode3')" style="width: 110px; min-width: 110px;">mode3</th>
                                <th *ngIf="isColVisible('mode2')" style="width: 110px; min-width: 110px;">mode2</th>
                                <th *ngIf="isColVisible('icao')" style="width: 110px; min-width: 110px;">icao</th>
                                <th *ngIf="isColVisible('locationTakeOff')" style="width: 180px; min-width: 180px;">منطقة الأقلاع</th>
                                <th *ngIf="isColVisible('file103Note')" style="width: 200px; min-width: 200px;">ملاحظات الحدث</th>
                                <th *ngIf="isColVisible('targetJndis')" style="width: 180px; min-width: 180px;">ارتباط بالهدف</th>
                                <th *ngIf="isColVisible('numberBook')" style="width: 140px; min-width: 140px;">رقم الكتاب</th>
                                <th *ngIf="isColVisible('country')" style="width: 160px; min-width: 160px;">الدولة</th>
                                <th *ngIf="isColVisible('city')" style="width: 100px; min-width: 100px;">المحافظة</th>
                                <th *ngIf="isColVisible('district')" style="width: 100px; min-width: 100px;">القضاء</th>
                                <th *ngIf="isColVisible('handDistrict')" style="width: 100px; min-width: 100px;">الناحية</th>
                                <th *ngIf="isColVisible('neighbourhood')" style="width: 180px; min-width: 180px;">المنطقة</th>
                                <th *ngIf="isColVisible('coordinates')" style="width: 200px; min-width: 200px;">الأحداثي الجغرافي</th>
                                <th *ngIf="isColVisible('coordinateTypes')" style="width: 180px; min-width: 180px;">نوع الاحداثي الجغرافي</th>
                                <th *ngIf="isColVisible('category')" style="width: 110px; min-width: 110px;">التصنيف</th>
                                <th *ngIf="isColVisible('gisAuditing')" style="width: 100px; min-width: 100px;">GIS</th>
                                <th *ngIf="isColVisible('auditing')" style="width: 200px; min-width: 200px;">التدقيق</th>
                                <th *ngIf="isColVisible('analysisOpinion')" style="width: 250px; min-width: 250px;">رأي التحليل</th>
                                <th *ngIf="isColVisible('completionText')" style="width: 250px; min-width: 250px;">نص الأستكمال</th>
                                <th *ngIf="isColVisible('proposals')" style="width: 250px; min-width: 250px;">الملاحظات</th>
                                <th *ngIf="isColVisible('addAuditingByUser')" style="width: 160px; min-width: 160px;">قييم بواسطة</th>
                                <th *ngIf="isColVisible('mu_id')" style="width: 200px; min-width: 200px;">منشئ الخبر</th>
                                <th *ngIf="isColVisible('nickName')" style="width: 160px; min-width: 160px;">الأضافة بواسطة</th>
                                <th *ngIf="isColVisible('createDate')" style="width: 180px; min-width: 180px;">وقت وتاريخ الأضافة</th>
                            </tr>
                            <tr>
                                <th class="select-col"></th>
                                <th class="action-col"></th>
                                <th class="action-col"></th>
                                <th class="action-col"></th>
                                <th class="action-col"></th>
                                <th class="action-col"></th>
                                <th class="action-col"></th>
                                <th class="action-col"></th>
                                <th *ngIf="isColVisible('id')"><p-columnFilter type="text" field="id" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('date_time')"><p-columnFilter type="text" field="date_time" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('source')"><p-columnFilter type="text" field="source_muId" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('typeArms')"><p-columnFilter type="text" field="additionArms.typeArms.name" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('symbol')"><p-columnFilter type="text" field="additionArms.symbolOrName" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('mission')"><p-columnFilter type="text" field="missionName.name" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('activityType')">
                                    <p-columnFilter field="activityType.name" matchMode="equals" [showMenu]="false">
                                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                            <p-select [ngModel]="value" [options]="activityTypes" (onChange)="filter($any($event).value)" placeholder="الكل" [showClear]="true" appendTo="body" />
                                        </ng-template>
                                    </p-columnFilter>
                                </th>
                                <th *ngIf="isColVisible('the_news')"><p-columnFilter type="text" field="the_news" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('org')"><p-columnFilter type="text" field="organization.orgName.name" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('otherHands')"><p-columnFilter type="text" field="otherHands" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('holdingForce')"><p-columnFilter type="text" field="holdingForce" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('typeOrgNames')"><p-columnFilter type="text" field="typeOrgNames" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('tripCode')"><p-columnFilter type="text" field="file103.tripCode" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('tripNumber')"><p-columnFilter type="text" field="file103.tripNumber" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('airCraftType')"><p-columnFilter type="text" field="file103.airCraftType.name" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('mode3')"><p-columnFilter type="text" field="file103.mode3" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('mode2')"><p-columnFilter type="text" field="file103.mode2" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('icao')"><p-columnFilter type="text" field="file103.icao" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('locationTakeOff')"><p-columnFilter type="text" field="file103.locationTakeOff.name" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('file103Note')"><p-columnFilter type="text" field="file103.note" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('targetJndis')"><p-columnFilter type="text" field="targetJndis" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('numberBook')"><p-columnFilter type="text" field="numberBook" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('country')">
                                    <p-columnFilter field="country.name" matchMode="equals" [showMenu]="false">
                                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                            <p-select [ngModel]="value" [options]="countries" (onChange)="filter($any($event).value)" placeholder="الكل" [showClear]="true" appendTo="body" />
                                        </ng-template>
                                    </p-columnFilter>
                                </th>
                                <th *ngIf="isColVisible('city')">
                                    <p-columnFilter field="city.name" matchMode="equals" [showMenu]="false">
                                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                            <p-select [ngModel]="value" [options]="cities" (onChange)="filter($any($event).value)" placeholder="الكل" [showClear]="true" appendTo="body" />
                                        </ng-template>
                                    </p-columnFilter>
                                </th>
                                <th *ngIf="isColVisible('district')">
                                    <p-columnFilter field="district.name" matchMode="equals" [showMenu]="false">
                                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                            <p-select [ngModel]="value" [options]="districts" (onChange)="filter($any($event).value)" placeholder="الكل" [showClear]="true" appendTo="body" />
                                        </ng-template>
                                    </p-columnFilter>
                                </th>
                                <th *ngIf="isColVisible('handDistrict')">
                                    <p-columnFilter field="handDistrict.name" matchMode="equals" [showMenu]="false">
                                        <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                            <p-select [ngModel]="value" [options]="handDistricts" (onChange)="filter($any($event).value)" placeholder="الكل" [showClear]="true" appendTo="body" />
                                        </ng-template>
                                    </p-columnFilter>
                                </th>
                                <th *ngIf="isColVisible('neighbourhood')"><p-columnFilter type="text" field="neighbourhood" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('coordinates')"><p-columnFilter type="text" field="coordinates" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('coordinateTypes')"><p-columnFilter type="text" field="coordinateTypes" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('category')"><p-columnFilter type="text" field="category" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('gisAuditing')"><p-columnFilter type="text" field="gisAuditing" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('auditing')"><p-columnFilter type="text" field="auditing" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('analysisOpinion')"><p-columnFilter type="text" field="analysisOpinion" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('completionText')"><p-columnFilter type="text" field="completionText" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('proposals')"><p-columnFilter type="text" field="proposals" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('addAuditingByUser')"><p-columnFilter type="text" field="addAuditingByUser" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('mu_id')"></th>
                                <th *ngIf="isColVisible('nickName')"><p-columnFilter type="text" field="nickName" placeholder="ابحث..." /></th>
                                <th *ngIf="isColVisible('createDate')"></th>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="body" let-event>
                            <tr>
                                <td class="select-col">
                                    <p-tableCheckbox [value]="event" />
                                </td>
                                <!-- Edit Action -->
                                <td class="action-col">
                                    <ng-container *ngIf="event.additionArms.symbolOrName === 'بينا'">
                                        <button 
                                            *ngIf="can('File103 Update')"
                                            pButton icon="pi pi-pencil" 
                                            class="action-btn p-button-success" 
                                            [routerLink]="['/admin/file103/create']" [queryParams]="{id: event.id}"
                                            pTooltip="تعديل (طيران)"></button>
                                    </ng-container>
                                    <ng-container *ngIf="event.additionArms.symbolOrName !== 'بينا'">
                                        <button 
                                            *ngIf="can('Militaryactivity Update')"
                                            pButton icon="pi pi-pencil" 
                                            class="action-btn p-button-success" 
                                            [routerLink]="['/apps/events/create']" [queryParams]="{id: event.id}"
                                            pTooltip="تعديل"></button>
                                    </ng-container>
                                </td>
                                <!-- Delete Action -->
                                <td class="action-col">
                                    <button 
                                        *ngIf="can('Militaryactivity Delete') || can('File103 Delete')"
                                        pButton icon="pi pi-trash" 
                                        class="action-btn p-button-danger" 
                                        (click)="confirmDelete(event)"
                                        pTooltip="حذف"></button>
                                </td>
                                <!-- Attachments -->
                                <td class="action-col">
                                    <p-badge [value]="event.uploadFiles.length" severity="secondary" *ngIf="event.uploadFiles.length > 0">
                                        <button pButton icon="pi pi-file" class="action-btn p-button-secondary" (click)="viewAttachments(event)" pTooltip="المرفقات"></button>
                                    </p-badge>
                                    <button pButton icon="pi pi-file" class="action-btn p-button-secondary" *ngIf="event.uploadFiles.length === 0" (click)="viewAttachments(event)" pTooltip="لا يوجد مرفقات"></button>
                                </td>
                                <!-- Results/Users -->
                                <td class="action-col">
                                    <button 
                                        *ngIf="event.additionArms.symbolOrName !== 'بينا'" 
                                        pButton icon="pi pi-users" 
                                        class="action-btn p-button-warning" 
                                        (click)="viewResults(event)"
                                        pTooltip="الجهات المشاركة"></button>
                                </td>
                                <!-- Transfer -->
                                <td class="action-col">
                                    <p-badge [value]="event.transfers.length" severity="danger" *ngIf="can('Transfer View') && event.transfers.length > 0">
                                        <button pButton icon="pi pi-send" class="action-btn p-button-primary" (click)="openTransfer(event)" pTooltip="ترحيل"></button>
                                    </p-badge>
                                    <button *ngIf="can('Transfer View') && (event.transfers.length === 0 || !event.transfers)" pButton icon="pi pi-send" class="action-btn p-button-primary" (click)="openTransfer(event)" pTooltip="ترحيل"></button>
                                </td>
                                <!-- Auditing -->
                                <td class="action-col">
                                    <button 
                                        *ngIf="can('Auditing Create')" 
                                        pButton icon="pi pi-book" 
                                        [class]="'action-btn ' + (event.category ? 'p-button-warning' : 'p-button-primary')" 
                                        (click)="openAuditing(event)"
                                        pTooltip="تقييم"></button>
                                </td>
                                <!-- Seizure -->
                                <td class="action-col">
                                    <button pButton icon="pi pi-list" class="action-btn p-button-secondary" (click)="openSeizure(event)" pTooltip="المضبوطات"></button>
                                </td>

                                <td *ngIf="isColVisible('id')">{{event.id}}</td>
                                <td *ngIf="isColVisible('date_time')">{{event.date_time}} {{event.time_news}}</td>
                                <td *ngIf="isColVisible('source')" [title]="event.source_muId">{{event.source_muId}}</td>
                                <td *ngIf="isColVisible('typeArms')" [title]="event.additionArms.typeArms.name">{{event.additionArms.typeArms.name}}</td>
                                <td *ngIf="isColVisible('symbol')" [title]="event.additionArms.symbolOrName">{{event.additionArms.symbolOrName}}</td>
                                <td *ngIf="isColVisible('mission')" [title]="event.missionName.name">{{event.missionName.name}}</td>
                                <td *ngIf="isColVisible('activityType')" [title]="event.activityType.name">{{event.activityType.name}}</td>
                                <td *ngIf="isColVisible('the_news')" [title]="event.the_news" [pTooltip]="event.the_news">{{event.the_news}}</td>
                                <td *ngIf="isColVisible('org')" [title]="event.organization.orgName.name">{{event.organization.orgName.name}}</td>
                                <td *ngIf="isColVisible('otherHands')">
                                    <div *ngFor="let hand of event.otherHands" [title]="hand.name">{{hand.name}}</div>
                                </td>
                                <td *ngIf="isColVisible('holdingForce')" [title]="event.holdingForce">{{event.holdingForce}}</td>
                                <td *ngIf="isColVisible('typeOrgNames')">
                                    <div *ngFor="let typeOrg of event.typeOrgNames" [title]="typeOrg.name">{{typeOrg.name}}</div>
                                </td>
                                <td *ngIf="isColVisible('tripCode')" [title]="event.file103?.tripCode">{{event.file103?.tripCode}}</td>
                                <td *ngIf="isColVisible('tripNumber')" [title]="event.file103?.tripNumber">{{event.file103?.tripNumber}}</td>
                                <td *ngIf="isColVisible('airCraftType')" [title]="event.file103?.airCraftType?.name">{{event.file103?.airCraftType?.name}}</td>
                                <td *ngIf="isColVisible('mode3')" [title]="event.file103?.mode3">{{event.file103?.mode3}}</td>
                                <td *ngIf="isColVisible('mode2')" [title]="event.file103?.mode2">{{event.file103?.mode2}}</td>
                                <td *ngIf="isColVisible('icao')" [title]="event.file103?.icao">{{event.file103?.icao}}</td>
                                <td *ngIf="isColVisible('locationTakeOff')" [title]="event.file103?.locationTakeOff?.name">{{event.file103?.locationTakeOff?.name}}</td>
                                <td *ngIf="isColVisible('file103Note')" [title]="event.file103?.note" [pTooltip]="event.file103?.note">{{event.file103?.note}}</td>
                                <td *ngIf="isColVisible('targetJndis')">
                                    <div *ngFor="let goal of event.targetJndis">{{goal.targetId}}</div>
                                </td>
                                <td *ngIf="isColVisible('numberBook')" [title]="event.numberBook">{{event.numberBook}}</td>
                                <td *ngIf="isColVisible('country')" [title]="event.country.name">{{event.country.name}}</td>
                                <td *ngIf="isColVisible('city')" [title]="event.city.name">{{event.city.name}}</td>
                                <td *ngIf="isColVisible('district')" [title]="event.district.name">{{event.district.name}}</td>
                                <td *ngIf="isColVisible('handDistrict')" [title]="event.handDistrict.name">{{event.handDistrict.name}}</td>
                                <td *ngIf="isColVisible('neighbourhood')" [title]="event.neighbourhood" [pTooltip]="event.neighbourhood">{{event.neighbourhood}}</td>
                                <td *ngIf="isColVisible('coordinates')">
                                    <p-button [label]="event.cordinatesString" (onClick)="showMap(event)" [text]="true" styleClass="p-0 font-bold text-sm text-gray-900" />
                                </td>
                                <td *ngIf="isColVisible('coordinateTypes')">
                                    <div *ngFor="let coord of event.coordinates">{{coord.coordinateType.typeName}}</div>
                                </td>
                                <td *ngIf="isColVisible('category')">
                                    <span [class]="'customer-badge status-' + getCategoryClass(event.category)">{{event.category}}</span>
                                </td>
                                <td *ngIf="isColVisible('gisAuditing')">
                                    <span [class]="'customer-badge status-' + (event.gisAuditing === 'تظاف' ? 'qualified' : 'unqualified')">{{event.gisAuditing}}</span>
                                </td>
                                <td *ngIf="isColVisible('auditing')" [title]="event.auditing" [pTooltip]="event.auditing">{{event.auditing}}</td>
                                <td *ngIf="isColVisible('analysisOpinion')" [title]="event.analysisOpinion" [pTooltip]="event.analysisOpinion">{{event.analysisOpinion}}</td>
                                <td *ngIf="isColVisible('completionText')" [title]="event.completionText" [pTooltip]="event.completionText">{{event.completionText}}</td>
                                <td *ngIf="isColVisible('proposals')" [title]="event.proposals" [pTooltip]="event.proposals">{{event.proposals}}</td>
                                <td *ngIf="isColVisible('addAuditingByUser')">{{event.addAuditingByUser}}</td>
                                <td *ngIf="isColVisible('mu_id')">{{event.mu_id}}</td>
                                <td *ngIf="isColVisible('nickName')">{{event.nickName}}</td>
                                <td *ngIf="isColVisible('createDate')">
                                    {{event.createDate.year}}/{{event.createDate.month.value}}/{{event.createDate.dayOfMonth}}<br/>
                                    {{event.createDate.hour}}:{{event.createDate.minute}}
                                </td>
                            </tr>

                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>

        <!-- Attachment Dialog -->
        <p-dialog header="المرفقات" [(visible)]="uploadDialog" [modal]="true" [style]="{width: '1200px'}" [maximizable]="true">
            <div class="p-grid p-4">
                <div class="p-col-12 p-md-4">
                    <p-table [value]="selectedEvent?.uploadFiles || []" styleClass="p-datatable-sm">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>اسم المرفق</th>
                                <th style="width: 80px">إجراء</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-file>
                            <tr>
                                <td>{{file.pathFile}}</td>
                                <td>
                                    <p-button icon="pi pi-eye" (onClick)="previewFile(file)" />
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
                <div class="p-col-12 p-md-8 border-1 surface-border border-round bg-gray-100 flex items-center justify-center min-h-[400px]">
                    <div *ngIf="!currentPreview" class="text-center">
                        <i class="pi pi-image text-8xl text-gray-400"></i>
                        <p class="mt-4">يرجى اختيار مرفق للعرض</p>
                    </div>
                    <div *ngIf="currentPreview" class="w-full h-full">
                         <!-- TODO: Implement file preview based on extension -->
                         <img *ngIf="isImage(currentPreview.pathFile)" [src]="'assets/files/' + currentPreview.pathFile" class="max-w-full" />
                         <div *ngIf="!isImage(currentPreview.pathFile)" class="p-8 text-center">
                             معاينة الملف ({{currentPreview.pathFile}}) ستكون متاحة هنا.
                         </div>
                    </div>
                </div>
            </div>
        </p-dialog>

        <!-- Transfer Dialog -->
        <p-dialog header="الترحيل" [(visible)]="transferDialog" [modal]="true" [style]="{width: '800px'}">
            <div class="p-fluid">
                <p class="text-red-500 mb-4">من خلال الترحيل يمكنك مشاركة الحدث الخاص بك لوحدات ادارية اخرى</p>
                <div class="p-grid bg-blue-50 p-4 border-round-xl mb-4">
                    <div class="p-col-12">
                        <label class="font-bold block mb-2">الوحدة الإدارية:</label>
                        <div class="flex gap-2">
                            <p-select [options]="managementUnits" [(ngModel)]="selectedMuId" placeholder="يرجى الأختيار" class="flex-grow-1" />
                            <p-button icon="pi pi-plus" (onClick)="addTransfer()" [disabled]="!selectedMuId" />
                        </div>
                    </div>
                </div>
                <p-divider />
                <p-table [value]="selectedEvent?.transfers || []" [rows]="10" [paginator]="true">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 70px">حذف</th>
                            <th>الوحدة الإدارية</th>
                            <th>بواسطة</th>
                            <th>التاريخ</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-tr>
                        <tr>
                            <td><p-button icon="pi pi-trash" severity="danger" [rounded]="true" (onClick)="removeTransfer(tr)" /></td>
                            <td>{{tr.unitName}}</td>
                            <td>{{tr.nickName}}</td>
                            <td>{{tr.date}}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-dialog>

        <!-- Auditing Dialog -->
        <p-dialog header="التقييم" [(visible)]="auditingDialog" [modal]="true" [style]="{width: '900px'}" [maximizable]="true">
            <div class="p-fluid grid" *ngIf="auditingData">
                <div class="col-12 mb-3">
                    <p class="font-bold">{{auditingData.the_news}}</p>
                </div>
                <div class="col-12 md:col-12 mb-3">
                    <label class="font-bold">التصنيف *</label>
                    <p-select [options]="categories" [(ngModel)]="auditingData.category" />
                </div>
                <div class="col-12 md:col-6 mb-3">
                    <label class="font-bold">التدقيق</label>
                    <textarea pTextarea rows="5" [(ngModel)]="auditingData.auditing"></textarea>
                </div>
                <div class="col-12 md:col-6 mb-3">
                    <label class="font-bold">الأحداثيات الجغرافية المرتبطة</label>
                    <p-table [value]="auditingData.coordinates || []" styleClass="p-datatable-sm">
                        <ng-template pTemplate="body" let-coord>
                            <tr>
                                <td style="width: 3rem"><p-checkbox [(ngModel)]="coord.mapInclude" [binary]="true" /></td>
                                <td>{{coord.name}} | {{coord.coordinateType.typeName}}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
                <div class="col-12 mb-3">
                    <label class="font-bold">رأي التحليل</label>
                    <textarea pTextarea rows="3" [(ngModel)]="auditingData.analysisOpinion"></textarea>
                </div>
                <div class="col-12 mb-3">
                    <label class="font-bold">نص الأستكمال</label>
                    <textarea pTextarea rows="3" [(ngModel)]="auditingData.completionText"></textarea>
                </div>
                <div class="col-12 mb-3">
                    <label class="font-bold">مقترحات</label>
                    <textarea pTextarea rows="2" [(ngModel)]="auditingData.proposals"></textarea>
                </div>
                <div class="col-12 md:col-3 mb-3">
                    <label class="font-bold">المحافظة</label>
                    <p-select [options]="cities" [(ngModel)]="auditingData.city.name" placeholder="اختيار" />
                </div>
                <div class="col-12 md:col-3 mb-3">
                    <label class="font-bold">القضاء</label>
                    <p-select [options]="districts" [(ngModel)]="auditingData.district.name" placeholder="اختيار" />
                </div>
                <div class="col-12 md:col-3 mb-3">
                    <label class="font-bold">الناحية</label>
                    <p-select [options]="handDistricts" [(ngModel)]="auditingData.handDistrict.name" placeholder="اختيار" />
                </div>
                <div class="col-12 md:col-3 mb-3">
                    <label class="font-bold">المنطقة</label>
                    <input pInputText [(ngModel)]="auditingData.neighbourhood" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <p-button label="حفظ" icon="pi pi-check" (onClick)="saveAuditing()" />
                <p-button label="إلغاء" icon="pi pi-times" severity="secondary" (onClick)="auditingDialog = false" />
            </ng-template>
        </p-dialog>

        <!-- Map Placeholder Dialog -->
        <p-dialog header="عرض الموقع" [(visible)]="mapDialog" [modal]="true" [style]="{width: '700px', height: '550px'}">
            <div class="flex flex-col items-center justify-center h-full bg-gray-100 border-round">
                <i class="pi pi-map text-6xl text-gray-400 mb-4"></i>
                <p class="text-xl font-bold text-gray-600">سيتم عرض الخريطة عبر API لاحقاً</p>
                <p class="text-gray-500">(Leaflet/Google Maps Placeholder)</p>
            </div>
        </p-dialog>

        <p-confirmDialog />
    `,
    styles: [`
        .customer-badge { border-radius: 2px; padding: .25em .5rem; text-transform: uppercase; font-weight: 700; font-size: 12px; letter-spacing: .3px; }
        .status-qualified { background: #C8E6C9; color: #256029; }
        .status-new { background: #FEEDAF; color: #8A5340; }
        .status-negotiation { background: #B3E5FC; color: #23547B; }
        .status-unqualified { background: #FFCDD2; color: #C63737; }
    `]
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

