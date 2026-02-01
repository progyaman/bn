import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface UserProfileInfo {
    username: string;
    nickname: string;
    positionName: string;
    managementUnitPath: string;
}

@Component({
    selector: 'user-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, ToastModule, ButtonModule, DialogModule, PasswordModule],
    providers: [MessageService],
    template: `
        <div dir="rtl" class="grid">
            <p-toast />

            <div class="col-12 md:col-6">
                <div class="card">
                    <div class="card profile">
                        <div class="profile-header"></div>
                        <div class="profile-content">
                            <h6><span>اسم المستخدم :</span> {{ user().username }}</h6>
                            <br />
                            <h6><span>الكنية :</span> {{ user().nickname }}</h6>
                            <br />
                            <h6><span>المنصب :</span> {{ user().positionName }}</h6>
                            <br />
                            <h6><span>الوحدة الادارية :</span> {{ user().managementUnitPath }}</h6>
                            <br />

                            <p-button
                                type="button"
                                icon="pi pi-pencil"
                                label="تغير كلمة المرور"
                                styleClass="edit-button rounded-button"
                                (onClick)="openPasswordDialog()"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <p-dialog
                header="تغير كلمة المرور"
                [(visible)]="passwordDialogVisible"
                [modal]="true"
                [style]="{ width: '700px', maxWidth: '95vw' }"
                [draggable]="false"
                [resizable]="false"
            >
                <div class="ui-fluid">
                    <div class="p-field p-grid p-p-3">
                        <label class="p-text-bold p-col-12 p-md-5" for="password">ادخل كلمة المرور الجديدة</label>
                        <div class="p-col-12 p-md-7">
                            <p-password
                                inputId="password"
                                [(ngModel)]="newPassword"
                                [feedback]="true"
                                [toggleMask]="true"
                                strongLabel="ممتازة"
                                weakLabel="ضعيفة"
                                mediumLabel="جيدة"
                                promptLabel="ادخل كلمة المرور"
                                [maxlength]="255"
                                [style]="{ width: '100%' }"
                            />
                            <div class="text-xs text-surface-600 dark:text-surface-300 mt-2">
                                يجب أن تكون كلمة المرور 8 أحرف على الأقل
                            </div>
                        </div>
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <p-button type="button" label="حفظ" icon="pi pi-check" (onClick)="savePassword()" />
                    <p-button type="button" label="الغاء" icon="pi pi-times" severity="secondary" (onClick)="closePasswordDialog()" />
                </ng-template>
            </p-dialog>
        </div>
    `
})
export class UserProfile {
    user = signal<UserProfileInfo>({
        username: 'amir',
        nickname: '—',
        positionName: '—',
        managementUnitPath: '—'
    });

    passwordDialogVisible = false;
    newPassword = '';

    constructor(private messageService: MessageService) {}

    openPasswordDialog() {
        this.newPassword = '';
        this.passwordDialogVisible = true;
    }

    closePasswordDialog() {
        this.passwordDialogVisible = false;
    }

    savePassword() {
        if ((this.newPassword ?? '').trim().length < 8) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' });
            return;
        }

        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تغيير كلمة المرور (تجريبي)' });
        this.passwordDialogVisible = false;
    }
}
