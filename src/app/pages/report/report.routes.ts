import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'list' },
    {
        path: 'list',
        loadComponent: () => import('./report-list').then((m) => m.ReportListPage)
    },
    {
        path: 'create',
        loadComponent: () => import('./report-create').then((m) => m.ReportCreatePage)
    },
    {
        path: 'print',
        loadComponent: () => import('./report-print').then((m) => m.ReportPrintPage)
    }
] satisfies Routes;
