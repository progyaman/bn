import { Routes } from '@angular/router';
import { UserProfile } from './profile/profile';

export default [
    { path: '', data: { breadcrumb: 'ادارة الحساب' }, component: UserProfile }
] as Routes;
