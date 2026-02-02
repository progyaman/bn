import { Routes } from '@angular/router';

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
    },
    {
        path: 'create',
        loadComponent: () => import('./create/create').then((c) => c.CreateEvent),
        data: { breadcrumb: 'إضافة حدث' }
    },
    {
        path: 'list',
        loadComponent: () => import('./list/list').then((c) => c.EventsList),
        data: { breadcrumb: 'جدول الأحداث' }
    },
    {
        path: 'check',
        loadComponent: () => import('./check/check').then((c) => c.EventsCheck),
        data: { breadcrumb: 'تدقيق' }
    },
    {
        path: 'completing',
        loadComponent: () => import('./completing/completing').then((c) => c.EventsCompleting),
        data: { breadcrumb: 'استكمال' }
    },
    {
        path: 'refused',
        loadComponent: () => import('./refused/refused').then((c) => c.EventsRefused),
        data: { breadcrumb: 'الأحداث المرفوضة' }
    }
] as Routes;
