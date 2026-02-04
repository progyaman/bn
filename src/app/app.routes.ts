import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthLayout } from '@/layout/components/app.authlayout';
import { Notfound } from '@/pages/notfound/notfound';
import { authGuard } from '@/auth/auth.guard';

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () => import('@/pages/auth/login').then((c) => c.Login)
	},
	{
		path: '',
		component: AppLayout,
		canActivate: [authGuard],
		children: [
			{
				path: '',
				redirectTo: 'welcome',
				pathMatch: 'full'
			},
			{
				path: 'welcome',
				loadComponent: () => import('@/features/welcome/welcome.component').then((c) => c.WelcomeComponent),
				data: { breadcrumb: 'الترحيب' }
			},
			{
				path: 'dashboard',
				loadComponent: () => import('@/pages/dashboards/milry/generaldashboard').then((c) => c.GeneralDashboard),
				data: { breadcrumb: 'الإحصائيات العامة' }
			},
			{
				path: 'dashboard-arrested',
				loadComponent: () => import('@/pages/dashboards/milry/arresteddashboard').then((c) => c.ArrestedDashboard),
				data: { breadcrumb: 'إحصائيات المعتقلين' }
			},
			{
				path: 'dashboard-files',
				loadComponent: () => import('@/pages/dashboards/milry/filesdashboard').then((c) => c.FilesDashboard),
				data: { breadcrumb: 'إحصائيات الملفات' }
			},
			{
				path: 'dashboard-infograph',
				loadComponent: () => import('@/pages/dashboards/milry/infographdashboard').then((c) => c.InfographDashboard),
				data: { breadcrumb: 'الحصاد' }
			},
			{
				path: 'uikit',
				data: { breadcrumb: 'ملف 103' },
				loadChildren: () => import('@/pages/file103/file103.routes')
			},
			{
				path: 'study',
				data: { breadcrumb: 'الدراسات' },
				loadChildren: () => import('@/pages/study/study.routes')
			},
			{
				path: 'report',
				data: { breadcrumb: 'التقارير' },
				loadChildren: () => import('@/pages/report/report.routes')
			},
			{
				path: 'discover',
				data: { breadcrumb: 'الكشوفات' },
				loadChildren: () => import('@/pages/discover/discover.routes')
			},
			{
				path: 'positionOfArrivals',
				loadChildren: () => import('@/pages/positionOfArrivals/positionOfArrivals.routes'),
				data: { breadcrumb: 'موقف الوافدين' }
			},
			{
				path: 'documentation',
				data: { breadcrumb: 'Documentation' },
				loadComponent: () => import('@/pages/documentation/documentation').then((c) => c.Documentation)
			},
			{
				path: 'pages',
				loadChildren: () => import('@/pages/pages.routes'),
				data: { breadcrumb: 'Pages' }
			},
			{
				path: 'apps',
				loadChildren: () => import('@/apps/apps.routes'),
				data: { breadcrumb: 'Apps' }
			},
			{
				path: 'settings',
				data: { breadcrumb: 'الإعدادات' },
				loadChildren: () => import('./pages/settings/settings.routes')
			},
			{
				path: 'blocks',
				data: { breadcrumb: 'Free Blocks' },
				loadChildren: () => import('@/pages/blocks/blocks.routes')
			},
			{
				path: 'profile',
				loadChildren: () => import('@/pages/usermanagement/usermanagement.routes')
			}
		]
	},
	{ path: 'notfound', component: Notfound },
	{
		path: 'auth',
		component: AuthLayout,
		children: [
			{
				path: 'register',
				loadComponent: () => import('@/pages/auth/register').then((c) => c.Register)
			},
			{
				path: 'verification',
				loadComponent: () => import('@/pages/auth/verification').then((c) => c.Verification)
			},
			{
				path: 'forgot-password',
				loadComponent: () => import('@/pages/auth/forgotpassword').then((c) => c.ForgotPassword)
			},
			{
				path: 'lock-screen',
				loadComponent: () => import('@/pages/auth/lockscreen').then((c) => c.LockScreen)
			},
			{
				path: 'access',
				loadComponent: () => import('@/pages/auth/access').then((c) => c.Access)
			},
			{
				path: 'error',
				redirectTo: '/notfound'
			}
		]
	},
	{ path: '**', redirectTo: '/notfound' }
];
