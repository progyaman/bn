import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'create' },
    {
        path: 'create',
        loadComponent: () => import('./file103-create').then((m) => m.File103CreatePage)
    },
    {
        path: 'lost',
        loadComponent: () => import('./file103-lost').then((m) => m.File103LostPage)
    }
] satisfies Routes;
