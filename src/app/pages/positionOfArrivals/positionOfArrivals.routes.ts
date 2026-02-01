import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'list' },
    {
        path: 'list',
        loadComponent: () => import('./positionOfArrivals-list').then((m) => m.PositionOfArrivalsListPage)
    },
    {
        path: 'create',
        loadComponent: () => import('./positionOfArrivals-create').then((m) => m.PositionOfArrivalsCreatePage)
    }
] satisfies Routes;
