import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'studio' },
    {
        path: 'studio',
        loadComponent: () => import('./map-studio').then((m) => m.MapStudioPage)
    }
] satisfies Routes;
