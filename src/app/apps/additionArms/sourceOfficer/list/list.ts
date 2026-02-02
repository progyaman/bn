import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface ManagementUnit {
    id: number;
    path: string;
}

interface ColumnDef {
    field: string;
    header: string;
    width?: string;
}

interface SourceOfficerRow {
    id: number;
    officer_nickName: string;
    name: string;
    fatherName: string;
    grandFatherName: string;
    phoneNumber: string;
    sourceSymbol: string;
    source_officer_muId: number;
    country: string;
    city: string;
    district: string;
    handDistrict: string;
    neighbourhood: string;
    nickName: string;
    coordinateSummary: string;
    coordinateTypesSummary: string;
    createDate: Date;
}

@Component({
    selector: 'app-source-officer-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        DividerModule,
        ConfirmDialogModule,
        ToastModule,
        MultiSelectModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './list.html',
    styleUrls: ['./list.scss']
})
export class SourceOfficerList {
    @ViewChild('dt') dt!: Table;

    private readonly managementUnits: ManagementUnit[] = [
        { id: 10, path: 'العراق / بغداد / الكرخ' },
        { id: 11, path: 'العراق / بغداد / الرصافة' },
        { id: 12, path: 'العراق / بابل / الحلة' }
    ];

    items = signal<SourceOfficerRow[]>([
        {
            id: 1,
            officer_nickName: 'أبو أحمد',
            name: 'أحمد',
            fatherName: 'حسين',
            grandFatherName: 'سالم',
            phoneNumber: '0770xxxxxxx',
            sourceSymbol: 'SO-11',
            source_officer_muId: 10,
            country: 'العراق',
            city: 'بغداد',
            district: 'الكرخ',
            handDistrict: 'المنصور',
            neighbourhood: 'الجامعة',
            nickName: 'المستخدم1',
            coordinateSummary: '12A AA 12345 12345',
            coordinateTypesSummary: 'GPS',
            createDate: new Date()
        },
        {
            id: 2,
            officer_nickName: 'أبو علي',
            name: 'علي',
            fatherName: 'محمد',
            grandFatherName: 'جاسم',
            phoneNumber: '0780xxxxxxx',
            sourceSymbol: 'SO-12',
            source_officer_muId: 11,
            country: 'العراق',
            city: 'بابل',
            district: 'الحلة',
            handDistrict: 'المحاويل',
            neighbourhood: 'السلام',
            nickName: 'المستخدم2',
            coordinateSummary: '',
            coordinateTypesSummary: '',
            createDate: new Date()
        }
    ]);

    allColumns: ColumnDef[] = [
        { field: 'officer_nickName', header: 'الكنية', width: '12rem' },
        { field: 'name', header: 'أسم ضابط المصدر', width: '12rem' },
        { field: 'fatherName', header: 'أسم الاب', width: '12rem' },
        { field: 'grandFatherName', header: 'أسم الجد', width: '12rem' },
        { field: 'phoneNumber', header: 'رقم الهاتف', width: '12rem' },
        { field: 'sourceSymbol', header: 'رمز الضابط', width: '12rem' },
        { field: 'source_officer_muId', header: 'العائدية', width: '16rem' },
        { field: 'country', header: 'الدولة', width: '12rem' },
        { field: 'city', header: 'المحافظة', width: '12rem' },
        { field: 'district', header: 'القضاء', width: '12rem' },
        { field: 'handDistrict', header: 'الناحية', width: '12rem' },
        { field: 'neighbourhood', header: 'المنطقة', width: '12rem' },
        { field: 'nickName', header: 'الأضافة بواسطة', width: '12rem' },
        { field: 'coordinateSummary', header: 'الأحداثي الجغرافي', width: '14rem' },
        { field: 'coordinateTypesSummary', header: 'نوع الاحداثي الجغرافي', width: '14rem' }
    ];

    visibleColumns: ColumnDef[] = [
        this.allColumns[0],
        this.allColumns[1],
        this.allColumns[4],
        this.allColumns[5],
        this.allColumns[6]
    ];

    globalFilterFields: string[] = [
        'officer_nickName',
        'name',
        'fatherName',
        'grandFatherName',
        'phoneNumber',
        'sourceSymbol',
        'country',
        'city',
        'district',
        'handDistrict',
        'neighbourhood',
        'nickName',
        'coordinateSummary',
        'coordinateTypesSummary'
    ];

    constructor(
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    onGlobalFilter(table: Table, event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    confirmDelete(row: SourceOfficerRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.items.set(this.items().filter((x) => x.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف السجل' });
            }
        });
    }

    valueByField(row: SourceOfficerRow, field: string): unknown {
        if (field === 'source_officer_muId') {
            return this.managementUnits.find((m) => m.id === row.source_officer_muId)?.path ?? '';
        }
        return (row as unknown as Record<string, unknown>)[field];
    }
}
