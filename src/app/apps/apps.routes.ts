import { Routes } from '@angular/router';

export default [
    {
        path: 'events',
        loadChildren: () => import('./events/events.routes'),
        data: { breadcrumb: 'الأحداث' }
    },
    {
        path: 'additionArms',
        loadChildren: () => import('./additionArms/additionArms.routes'),
        data: { breadcrumb: 'اذرع الجمع' }
    }
] as Routes;
