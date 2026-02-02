import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
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
    name: string;
    size?: number;
}

interface StudyModel {
    name: string;
    studyType: StudyTypeOption | null;
    placeIssue: string;
    date: Date | null;
    uploadFiles: StudyAttachment[];
}

@Component({
    selector: 'app-study-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ToastModule,
        ButtonModule,
        DividerModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        FileUploadModule,
        TableModule
    ],
    providers: [MessageService],
    templateUrl: './create.html',
    styleUrl: './create.scss'
})
export class StudyCreatePage {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    editId: number | null = null;

    studyTypes: StudyTypeOption[] = [
        { id: 1, name: 'تحقيقية' },
        { id: 2, name: 'ميدانية' },
        { id: 3, name: 'أخرى' }
    ];

    model: StudyModel = {
        name: '',
        studyType: null,
        placeIssue: '',
        date: null,
        uploadFiles: []
    };

    constructor() {
        const idParam = this.route.snapshot.queryParamMap.get('id');
        const id = idParam ? Number(idParam) : NaN;
        this.editId = Number.isFinite(id) ? id : null;

        if (this.editId) {
            this.model = {
                name: `دراسة رقم ${this.editId}`,
                studyType: this.studyTypes[0],
                placeIssue: '—',
                date: new Date(),
                uploadFiles: []
            };
        }
    }

    private newId(): string {
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    onFilesSelect(event: FileSelectEvent): void {
        const files = event.files ?? [];
        const next = [...this.model.uploadFiles];
        for (const file of files) {
            next.push({
                id: this.newId(),
                name: file.name,
                size: file.size
            });
        }
        this.model.uploadFiles = next;
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة المرفقات (تجريبي)' });
    }

    removeAttachment(id: string): void {
        this.model.uploadFiles = this.model.uploadFiles.filter((x) => x.id !== id);
    }

    save(): void {
        if (!this.model.name.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل اسم الدراسة' });
            return;
        }
        if (!this.model.studyType) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل نوع الدراسة' });
            return;
        }
        if (!this.model.placeIssue.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل مكان الأصدار' });
            return;
        }
        if (!this.model.date) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى ملئ حقل التاريخ' });
            return;
        }

        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم الحفظ بنجاح (تجريبي)' });
        void this.router.navigate(['/study/list']);
    }
}
