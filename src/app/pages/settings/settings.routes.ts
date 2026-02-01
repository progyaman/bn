import { Routes } from '@angular/router';

export default [
	{ path: '', pathMatch: 'full', redirectTo: 'activitytype' },
	{
		path: 'activitytype',
		data: { breadcrumb: 'نوع النشاط' },
		loadComponent: () => import('./activitytype/activitytype').then((m) => m.SettingsActivityType)
	},
	{
		path: 'aircrafttype',
		data: { breadcrumb: 'نوع الرصد' },
		loadComponent: () => import('./aircrafttype/aircrafttype').then((m) => m.SettingsAircraftType)
	},
	{
		path: 'category',
		data: { breadcrumb: 'المضبوطات' },
		loadComponent: () => import('./category/category').then((m) => m.SettingsCategory)
	},
	{
		path: 'coordinate',
		data: { breadcrumb: 'الأحداثي الجغرافي' },
		loadComponent: () => import('./coordinate/coordinate').then((m) => m.SettingsCoordinate)
	},
	{
		path: 'coordinate_type',
		data: { breadcrumb: 'نوع الاحداثي الجغرافي' },
		loadComponent: () => import('./coordinate_type/coordinate_type').then((m) => m.SettingsCoordinateType)
	},
	{
		path: 'country',
		data: { breadcrumb: 'الدولة' },
		loadComponent: () => import('./country/country').then((m) => m.SettingsCountry)
	},
	{
		path: 'city',
		data: { breadcrumb: 'المحافظة' },
		loadComponent: () => import('./city/city').then((m) => m.SettingsCity)
	},
	{
		path: 'district',
		data: { breadcrumb: 'القضاء' },
		loadComponent: () => import('./district/district').then((m) => m.SettingsDistrict)
	},
	{
		path: 'handdistrict',
		data: { breadcrumb: 'الناحية' },
		loadComponent: () => import('./handdistrict/handdistrict').then((m) => m.SettingsHandDistrict)
	},
	{
		path: 'dependency',
		data: { breadcrumb: 'التبعية' },
		loadComponent: () => import('./dependency/dependency').then((m) => m.SettingsDependency)
	},
	{
		path: 'destinySeizure',
		data: { breadcrumb: 'المصير' },
		loadComponent: () => import('./destinySeizure/destinySeizure').then((m) => m.SettingsDestinySeizure)
	},
	{
		path: 'locationTakeOff',
		data: { breadcrumb: 'موقع الأقلاع' },
		loadComponent: () => import('./locationTakeOff/locationTakeOff').then((m) => m.SettingsLocationTakeOff)
	},
	{
		path: 'mission',
		data: { breadcrumb: 'المهمة او العملية' },
		loadComponent: () => import('./mission/mission').then((m) => m.SettingsMission)
	},
	{
		path: 'import_export',
		data: { breadcrumb: 'الاستيراد' },
		loadComponent: () => import('./import_export/import_export').then((m) => m.SettingsImportExport)
	},
	{
		path: 'nameOrSymbol',
		data: { breadcrumb: 'الاسم او الرمز' },
		loadComponent: () => import('./nameOrSymbol/nameOrSymbol').then((m) => m.SettingsNameOrSymbol)
	},
	{
		path: 'observatory',
		data: { breadcrumb: 'المرصد' },
		loadComponent: () => import('./observatory/observatory').then((m) => m.SettingsObservatory)
	},
	{
		path: 'orgName',
		data: { breadcrumb: 'التنظيم' },
		loadComponent: () => import('./orgName/orgName').then((m) => m.SettingsOrgName)
	},
	{
		path: 'org',
		data: { breadcrumb: 'اورك' },
		loadComponent: () => import('./org/org').then((m) => m.SettingsOrg)
	},
	{
		path: 'otherhand',
		data: { breadcrumb: 'جهات اخرى' },
		loadComponent: () => import('./otherhand/otherhand').then((m) => m.SettingsOtherHand)
	},
	{
		path: 'securityFile',
		data: { breadcrumb: 'ملف امني' },
		loadComponent: () => import('./securityFile/securityFile').then((m) => m.SettingsSecurityFile)
	},
	{
		path: 'source',
		data: { breadcrumb: 'مصدر' },
		loadComponent: () => import('./source/source').then((m) => m.SettingsSource)
	},
	{
		path: 'targetType',
		data: { breadcrumb: 'تاركت' },
		loadComponent: () => import('./targetType/targetType').then((m) => m.SettingsTargetType)
	},
	{
		path: 'typeArms',
		data: { breadcrumb: 'نوع ارمي' },
		loadComponent: () => import('./typeArms/typeArms').then((m) => m.SettingsTypeArms)
	},
	{
		path: 'typeOrgName',
		data: { breadcrumb: 'نوع التنظيم' },
		loadComponent: () => import('./typeOrgName/typeOrgName').then((m) => m.SettingsTypeOrgName)
	},
	{
		path: 'typeSeizure',
		data: { breadcrumb: 'نوع المضبوطات' },
		loadComponent: () => import('./typeSeizure/typeSeizure').then((m) => m.SettingsTypeSeizure)
	}
] as Routes;
