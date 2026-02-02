import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'list' },
    {
        path: 'list',
        loadComponent: () => import('./list/list').then((m) => m.StudyListPage)
    },
    {
        path: 'create',
        loadComponent: () => import('./create/create').then((m) => m.StudyCreatePage)
    }
] satisfies Routes;
