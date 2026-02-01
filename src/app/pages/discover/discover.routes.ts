import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'list' },
    {
        path: 'list',
        loadComponent: () => import('./discover-list').then((m) => m.DiscoverListPage)
    },
    {
        path: 'print/:key',
        loadComponent: () => import('./discover-print').then((m) => m.DiscoverPrintPage)
    },
    {
        path: ':key',
        loadComponent: () => import('./discover-report').then((m) => m.DiscoverReportPage)
    }
] satisfies Routes;
