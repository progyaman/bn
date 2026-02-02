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
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
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
