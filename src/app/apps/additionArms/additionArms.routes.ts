import { Routes } from '@angular/router';

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
    },
    {
        path: 'list',
        loadComponent: () => import('./additionsFile/list').then((c) => c.AdditionArmsList),
        data: { breadcrumb: 'جدول اذرع الجمع' }
    },
    {
        path: 'create',
        loadComponent: () => import('./additionsFile/create').then((c) => c.AdditionArmsCreate),
        data: { breadcrumb: 'اضافة ذراع جمع' }
    },
    {
        path: 'sourceOfficer',
        data: { breadcrumb: 'ضباط المصدر' },
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'list' },
            {
                path: 'list',
                loadComponent: () => import('./sourceOfficer/list').then((c) => c.SourceOfficerList),
                data: { breadcrumb: 'جدول ضباط المصدر' }
            },
            {
                path: 'create',
                loadComponent: () => import('./sourceOfficer/create').then((c) => c.SourceOfficerCreate),
                data: { breadcrumb: 'ضابط المصدر' }
            }
        ]
    }
] as Routes;
