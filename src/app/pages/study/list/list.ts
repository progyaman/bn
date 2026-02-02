import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

interface StudyTypeOption {
    id: number;
    name: string;
}

interface StudyAttachment {
    id: string;
    pathFile: string;
    size?: number;
}

interface StudyRow {
    id: number;
    name: string;
    studyType: StudyTypeOption;
    placeIssue: string;
    date: Date | null;
    uploadFiles: StudyAttachment[];
}

@Component({
    selector: 'app-study-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ToastModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        DialogModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './list.html',
    styleUrl: './list.scss'
})
export class StudyListPage {
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    q = '';
    selectedStudyTypeName: string | null = null;
    dateRange: Date[] | null = null;

    studyTypes: StudyTypeOption[] = [
        { id: 1, name: 'تحقيقية' },
        { id: 2, name: 'ميدانية' },
        { id: 3, name: 'أخرى' }
    ];

    studyTypeNames = this.studyTypes.map((x) => x.name);

    rows = signal<StudyRow[]>([
        {
            id: 101,
            name: 'دراسة تجريبية 1',
            studyType: { id: 1, name: 'تحقيقية' },
            placeIssue: 'بغداد',
            date: new Date(),
            uploadFiles: [
                { id: 'a1', pathFile: 'report.pdf', size: 1024 * 250 },
                { id: 'a2', pathFile: 'photo.jpg', size: 1024 * 120 }
            ]
        },
        {
            id: 102,
            name: 'دراسة تجريبية 2',
            studyType: { id: 2, name: 'ميدانية' },
            placeIssue: 'الموصل',
            date: new Date(new Date().setDate(new Date().getDate() - 7)),
            uploadFiles: []
        }
    ]);

    selected = signal<StudyRow | null>(null);
    attachmentsDialogOpen = false;

    filtered = computed(() => {
        const query = this.q.trim().toLowerCase();
        const typeName = (this.selectedStudyTypeName ?? '').trim();
        const [start, end] = this.dateRange && this.dateRange.length === 2 ? this.dateRange : [null, null];

        return this.rows().filter((r) => {
            if (typeName && r.studyType.name !== typeName) return false;

            if (query) {
                const hay = `${r.id} ${r.name} ${r.studyType.name} ${r.placeIssue}`.toLowerCase();
                if (!hay.includes(query)) return false;
            }

            if (start && end && r.date) {
                const t = r.date.getTime();
                const a = new Date(start).setHours(0, 0, 0, 0);
                const b = new Date(end).setHours(23, 59, 59, 999);
                if (t < a || t > b) return false;
            }

            return true;
        });
    });

    openAttachments(row: StudyRow): void {
        this.selected.set(row);
        this.attachmentsDialogOpen = true;
    }

    fakeView(file: StudyAttachment): void {
        this.messageService.add({ severity: 'info', summary: 'عرض', detail: `عرض تجريبي: ${file.pathFile}` });
    }

    confirmDelete(row: StudyRow): void {
        this.confirmationService.confirm({
            message: 'هل انت متأكد من الحذف ؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'كلا',
            accept: () => {
                this.rows.set(this.rows().filter((x) => x.id !== row.id));
                this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم الحذف بنجاح' });
            }
        });
    }
}
