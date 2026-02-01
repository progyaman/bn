import { Routes } from '@angular/router';

export default [
    {
        path: 'documentation',
        loadComponent: () => import('@/pages/documentation/documentation').then((c) => c.Documentation)
    },
    { path: 'empty', loadComponent: () => import('@/pages/empty/empty').then((c) => c.Empty), data: { breadcrumb: 'Empty' } },
    
    { path: 'help', loadComponent: () => import('@/pages/help/help').then((c) => c.Help), data: { breadcrumb: 'Help' } },
    {
        path: 'contact',
        loadComponent: () => import('@/pages/contactus/contactus').then((c) => c.ContactUs),
        data: { breadcrumb: 'Contact Us' }
    },
    {
        path: 'error',
        redirectTo: '/notfound'
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
