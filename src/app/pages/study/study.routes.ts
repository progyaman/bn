import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'list' },
    {
        path: 'list',
        loadComponent: () => import('./study-list').then((m) => m.StudyListPage)
    },
    {
        path: 'create',
        loadComponent: () => import('./study-create').then((m) => m.StudyCreatePage)
    }
] satisfies Routes;
