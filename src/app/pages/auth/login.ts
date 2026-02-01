import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {AuthLogoWidget} from '@/pages/auth/components/authlogowidget';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';
import {AuthService} from '@/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, AuthLogoWidget, RouterModule, InputTextModule, ButtonModule],
    styles: [
        `
            :host {
                display: block;
            }

            .bn-login-bg {
                /* Match template background (same token used by the layout) */
                background: var(--surface-ground);
            }

            .bn-login-bg::before {
                content: '';
                position: absolute;
                inset: 0;
                background:
                    radial-gradient(1000px 650px at 12% 18%, var(--menu-bg-color) 0%, transparent 60%),
                    radial-gradient(900px 600px at 88% 78%, var(--menu-bg-color-alt, var(--menu-bg-color)) 0%, transparent 55%);
                opacity: 0.12;
                pointer-events: none;
            }

            .bn-login-orb {
                position: absolute;
                width: 46rem;
                height: 46rem;
                border-radius: 9999px;
                filter: blur(60px);
                opacity: 0.6;
                background: radial-gradient(circle at 30% 30%, var(--menu-bg-color) 0%, transparent 70%);
                animation: bnOrbFloat 10s ease-in-out infinite;
                will-change: transform;
                pointer-events: none;
            }

            .bn-login-orb.orb-1 {
                top: -18rem;
                left: -18rem;
            }

            .bn-login-orb.orb-2 {
                right: -20rem;
                bottom: -22rem;
                animation-duration: 12s;
                animation-direction: reverse;
                opacity: 0.45;
            }

            @keyframes bnOrbFloat {
                0% {
                    transform: translate3d(0, 0, 0) scale(1);
                }
                50% {
                    transform: translate3d(2.5rem, 1.5rem, 0) scale(1.05);
                }
                100% {
                    transform: translate3d(0, 0, 0) scale(1);
                }
            }
        `
    ],
    template: `
        <div class="fixed inset-0 overflow-hidden">
            <div class="bn-login-bg absolute inset-0"></div>
            <div class="bn-login-orb orb-1"></div>
            <div class="bn-login-orb orb-2"></div>

            <div class="relative z-10 h-full w-full flex items-center justify-center px-6 sm:px-12">
                <div class="relative w-full max-w-184 mx-auto">
                    <div
                        class="w-full h-full inset-0 bg-white/64 dark:bg-surface-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[4deg] lg:rotate-[7deg] backdrop-blur-[90px] rounded-3xl shadow-[0px_87px_24px_0px_rgba(120,149,206,0.00),0px_56px_22px_0px_rgba(120,149,206,0.01),0px_31px_19px_0px_rgba(120,149,206,0.03),0px_14px_14px_0px_rgba(120,149,206,0.04),0px_3px_8px_0px_rgba(120,149,206,0.06)] dark:shadow-sm"
                    ></div>
                    <div
                        class="w-full h-full inset-0 bg-white/64 dark:bg-surface-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[4deg] lg:-rotate-[7deg] backdrop-blur-[90px] rounded-3xl shadow-[0px_87px_24px_0px_rgba(120,149,206,0.00),0px_56px_22px_0px_rgba(120,149,206,0.01),0px_31px_19px_0px_rgba(120,149,206,0.03),0px_14px_14px_0px_rgba(120,149,206,0.04),0px_3px_8px_0px_rgba(120,149,206,0.06)] dark:shadow-sm"
                    ></div>
                    <form
                        (ngSubmit)="onSubmit()"
                        dir="rtl"
                        class="animate-fadein animate-duration-300 animate-ease-in animate-scalein space-y-8 p-8 relative z-10 bg-white/64 dark:bg-surface-800 backdrop-blur-[90px] rounded-3xl shadow-[0px_87px_24px_0px_rgba(120,149,206,0.00),0px_56px_22px_0px_rgba(120,149,206,0.01),0px_31px_19px_0px_rgba(120,149,206,0.03),0px_14px_14px_0px_rgba(120,149,206,0.04),0px_3px_8px_0px_rgba(120,149,206,0.06)]"
                    >
                        <div class="pt-8 pb-8">
                            <div class="flex items-center justify-center">
                                <auth-logo-widget/>
                            </div>
                            <h1 class="text-4xl lg:text-6xl font-semibold text-surface-950 dark:text-surface-0 text-center">
                                تسجيل الدخول</h1>
                             
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="username" class="font-medium text-surface-500 dark:text-white/64 text-center">اسم المستخدم</label>
                            <input
                                [(ngModel)]="username"
                                name="username"
                                pInputText
                                id="username"
                                class="w-full text-center"
                                autocomplete="username"
                                required
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="password" class="font-medium text-surface-500 dark:text-white/64 text-center">كلمة المرور</label>
                            <input
                                [(ngModel)]="password"
                                name="password"
                                pInputText
                                id="password"
                                type="password"
                                class="w-full text-center"
                                autocomplete="current-password"
                                required
                            />
                        </div>

                        <p *ngIf="invalidCredentials" class="text-sm font-medium text-red-600 dark:text-red-400">
                            اسم المستخدم أو كلمة المرور غير صحيحة.
                        </p>
                        <p-button label="دخول" type="submit" styleClass="w-full" rounded />
                    </form>
                </div>
            </div>
        </div>
    `
})
export class Login {
    username = 'amir';
    password = '123';

    invalidCredentials = false;

    constructor(
        private readonly auth: AuthService,
        private readonly router: Router
    ) {
    }

    onSubmit() {
        this.invalidCredentials = false;

        const ok = this.auth.login(this.username, this.password);
        if (!ok) {
            this.invalidCredentials = true;
            return;
        }

        this.router.navigateByUrl('/');
    }
}
