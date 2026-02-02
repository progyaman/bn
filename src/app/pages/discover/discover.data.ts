export interface DiscoverReportItem {
    key: string;
    title: string;
}

export type DiscoverFilterType = 'date-range' | 'multi' | 'select' | 'text' | 'toggle' | 'year';

export interface DiscoverFilterConfig {
    key: string;
    label: string;
    type: DiscoverFilterType;
    options?: ReadonlyArray<string | { label: string; value: string | number | boolean }>;
}

export interface DiscoverReportConfig extends DiscoverReportItem {
    filters: DiscoverFilterConfig[];
    tableTitle?: string;
    columns?: string[];
    printLayout?: 'matrix' | 'table';
}

const COMMON_OPTIONS = {
    activityTypes: ['أمني', 'سياسي', 'عسكري', 'جنائي'],
    orgs: ['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة'],
    typeOrgs: ['داعش', 'القاعدة', 'مليشيات'],
    missions: ['مداهمة', 'تفتيش', 'كمين', 'رصد'],
    cities: ['بغداد', 'البصرة', 'نينوى', 'النجف'],
    districts: ['الكرخ', 'الرصافة', 'أبو غريب', 'العامرية'],
    otherHands: ['الشرطة الاتحادية', 'الجيش'],
    monjaz: ['الحشد', 'القوات الأمنية', 'مشترك', 'المدنيين', 'البنى التحتية'],
    armsNames: ['ميداني', 'علني', 'فني', 'رسمي', 'مصدر بشري', 'عكسي'],
    armsTypes: ['خفيف', 'متوسط', 'ثقيل'],
    armsSymbols: ['A-1', 'B-2', 'C-3'],
    enemyLosses: ['قتلى', 'جرحى', 'معتقلين'],
    ourLosses: ['شهداء', 'جرحى', 'مفقودين'],
    years: ['2022', '2023', '2024', '2025', '2026'],
    resultToggle: [
        { label: 'يحتوي', value: true },
        { label: 'لا يحتوي', value: false }
    ]
} as const;

export const DISCOVER_REPORTS: DiscoverReportItem[] = [
    { key: 'activityTypesInCitys', title: 'كشف العمليات في المحافظات' },
    { key: 'activityTypesInDistrict', title: 'كشف العمليات في الأقضية' },
    { key: 'collectionArmsInCity', title: 'كشف مصادر السلاح في المحافظات' },
    { key: 'collectionSymbolArmsInCity', title: 'كشف رموز مصادر السلاح في المحافظات' },
    { key: 'enemyCasualities', title: 'كشف خسائر العدو' },
    { key: 'enemyOrgActivity', title: 'كشف نشاط تنظيم العدو للمحافظات' },
    { key: 'enemyOrgActivityForDistrict', title: 'كشف نشاط تنظيم العدو للأقضية' },
    { key: 'maoforgoncity', title: 'كشف التنظيم في المحافظات' },
    { key: 'maoforgoncityEnemay', title: 'كشف تنظيم العدو في المحافظات' },
    { key: 'militaryactivity_at_month', title: 'كشف نوع الأحداث للأشهر' },
    { key: 'militaryActivityOrg_at_month', title: 'كشف نشاط التنظيم للأشهر' },
    { key: 'militaryOrg_at_month', title: 'كشف أنشطة التنظيم للأشهر' },
    { key: 'operationActivity', title: 'كشف العمليات النوعية' },
    { key: 'otherHandsActivitys', title: 'كشف أنشطة الجهات الأمنية' },
    { key: 'ourSidesCasualties', title: 'كشف خسائر القوات الأمنية والجهات الصديقة' }
];

export const DISCOVER_REPORT_CONFIGS: DiscoverReportConfig[] = [
    {
        key: 'activityTypesInCitys',
        title: 'كشف العمليات في المحافظات',
        tableTitle: 'كشف العمليات في المحافظات',
        columns: ['المحافظة', 'نوع الحدث', 'التنظيم', 'نوع التنظيم', 'عدد الحالات'],
        printLayout: 'matrix',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'activityTypes', label: 'نوع الحدث', type: 'multi', options: COMMON_OPTIONS.activityTypes },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'armsNames', label: 'اسم مصدر السلاح', type: 'multi', options: COMMON_OPTIONS.armsNames },
            { key: 'armsTypes', label: 'نوع السلاح', type: 'multi', options: COMMON_OPTIONS.armsTypes },
            { key: 'armsSymbols', label: 'رمز السلاح', type: 'multi', options: COMMON_OPTIONS.armsSymbols },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts },
            { key: 'requestUnit', label: 'جهة الطلب', type: 'text' },
            { key: 'reportName', label: 'عنوان الكشف', type: 'text' }
        ]
    },
    {
        key: 'activityTypesInDistrict',
        title: 'كشف العمليات في الأقضية',
        tableTitle: 'كشف العمليات في الأقضية',
        columns: ['القضاء', 'المحافظة', 'نوع الحدث', 'التنظيم', 'عدد الحالات'],
        printLayout: 'table',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'activityTypes', label: 'نوع الحدث', type: 'multi', options: COMMON_OPTIONS.activityTypes },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'armsNames', label: 'اسم مصدر السلاح', type: 'multi', options: COMMON_OPTIONS.armsNames },
            { key: 'armsTypes', label: 'نوع السلاح', type: 'multi', options: COMMON_OPTIONS.armsTypes },
            { key: 'armsSymbols', label: 'رمز السلاح', type: 'multi', options: COMMON_OPTIONS.armsSymbols },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts },
            { key: 'reportName', label: 'عنوان الكشف', type: 'text' }
        ]
    },
    {
        key: 'collectionArmsInCity',
        title: 'كشف مصادر السلاح في المحافظات',
        tableTitle: 'كشف مصادر السلاح في المحافظات',
        columns: ['المحافظة', 'نوع السلاح', 'مصدر السلاح', 'العدد'],
        printLayout: 'table',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'armsNames', label: 'اسم مصدر السلاح', type: 'multi', options: COMMON_OPTIONS.armsNames },
            { key: 'armsTypes', label: 'نوع السلاح', type: 'multi', options: COMMON_OPTIONS.armsTypes },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts },
            { key: 'requestUnit', label: 'جهة الطلب', type: 'text' },
            { key: 'reportName', label: 'عنوان الكشف', type: 'text' }
        ]
    },
    {
        key: 'collectionSymbolArmsInCity',
        title: 'كشف رموز مصادر السلاح في المحافظات',
        tableTitle: 'كشف رموز مصادر السلاح في المحافظات',
        columns: ['المحافظة', 'رمز السلاح', 'نوع السلاح', 'العدد'],
        printLayout: 'table',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'armsNames', label: 'اسم مصدر السلاح', type: 'multi', options: COMMON_OPTIONS.armsNames },
            { key: 'armsTypes', label: 'نوع السلاح', type: 'multi', options: COMMON_OPTIONS.armsTypes },
            { key: 'armsSymbols', label: 'رمز السلاح', type: 'multi', options: COMMON_OPTIONS.armsSymbols },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts },
            { key: 'reportName', label: 'عنوان الكشف', type: 'text' }
        ]
    },
    {
        key: 'enemyCasualities',
        title: 'كشف خسائر العدو',
        tableTitle: 'خسائر العدو في المحافظات',
        columns: ['المحافظة', 'نوع الخسائر', 'العدد'],
        printLayout: 'matrix',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'mission', label: 'اسم المهمة أو العملية', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'enemyLosses', label: 'نوع خسائر العدو', type: 'multi', options: COMMON_OPTIONS.enemyLosses },
            { key: 'reportName', label: 'عنوان الكشف', type: 'text' }
        ]
    },
    {
        key: 'enemyOrgActivity',
        title: 'كشف نشاط تنظيم العدو للمحافظات',
        tableTitle: 'نشاط تنظيم العدو للمحافظات',
        columns: ['المحافظة', 'التنظيم', 'نوع التنظيم', 'عدد النشاطات'],
        printLayout: 'table',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'activityTypes', label: 'نوع الحدث', type: 'multi', options: COMMON_OPTIONS.activityTypes },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts }
        ]
    },
    {
        key: 'enemyOrgActivityForDistrict',
        title: 'كشف نشاط تنظيم العدو للأقضية',
        tableTitle: 'نشاط تنظيم العدو للأقضية',
        columns: ['القضاء', 'المحافظة', 'التنظيم', 'عدد النشاطات'],
        printLayout: 'table',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'activityTypes', label: 'نوع الحدث', type: 'multi', options: COMMON_OPTIONS.activityTypes },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts }
        ]
    },
    {
        key: 'maoforgoncity',
        title: 'كشف التنظيم في المحافظات',
        tableTitle: 'التنظيم في المحافظات',
        columns: ['المحافظة', 'التنظيم', 'نوع التنظيم', 'العدد'],
        printLayout: 'matrix',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts },
            { key: 'reportName', label: 'عنوان الكشف', type: 'text' }
        ]
    },
    {
        key: 'maoforgoncityEnemay',
        title: 'كشف تنظيم العدو في المحافظات',
        tableTitle: 'تنظيم العدو في المحافظات',
        columns: ['المحافظة', 'التنظيم', 'نوع الخسائر', 'العدد'],
        printLayout: 'matrix',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'enemyLosses', label: 'نوع خسائر العدو', type: 'multi', options: COMMON_OPTIONS.enemyLosses },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts }
        ]
    },
    {
        key: 'militaryactivity_at_month',
        title: 'كشف نوع الأحداث للأشهر',
        tableTitle: 'نوع الأحداث للأشهر',
        columns: ['الشهر', 'نوع الحدث', 'العدد'],
        printLayout: 'table',
        filters: [
            { key: 'year', label: 'السنة', type: 'year', options: COMMON_OPTIONS.years },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'armsNames', label: 'اسم مصدر السلاح', type: 'multi', options: COMMON_OPTIONS.armsNames },
            { key: 'armsTypes', label: 'نوع السلاح', type: 'multi', options: COMMON_OPTIONS.armsTypes },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts }
        ]
    },
    {
        key: 'militaryActivityOrg_at_month',
        title: 'كشف نشاط التنظيم للأشهر',
        tableTitle: 'نشاط التنظيم للأشهر',
        columns: ['الشهر', 'التنظيم', 'نوع الحدث', 'العدد'],
        printLayout: 'table',
        filters: [
            { key: 'year', label: 'السنة', type: 'year', options: COMMON_OPTIONS.years },
            { key: 'activityTypes', label: 'نوع الحدث', type: 'multi', options: COMMON_OPTIONS.activityTypes },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'armsNames', label: 'اسم مصدر السلاح', type: 'multi', options: COMMON_OPTIONS.armsNames },
            { key: 'armsTypes', label: 'نوع السلاح', type: 'multi', options: COMMON_OPTIONS.armsTypes },
            { key: 'armsSymbols', label: 'رمز السلاح', type: 'multi', options: COMMON_OPTIONS.armsSymbols },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz }
        ]
    },
    {
        key: 'militaryOrg_at_month',
        title: 'كشف أنشطة التنظيم للأشهر',
        tableTitle: 'أنشطة التنظيم للأشهر',
        columns: ['الشهر', 'التنظيم', 'نوع التنظيم', 'العدد'],
        printLayout: 'table',
        filters: [
            { key: 'year', label: 'السنة', type: 'year', options: COMMON_OPTIONS.years },
            { key: 'activityTypes', label: 'نوع الحدث', type: 'multi', options: COMMON_OPTIONS.activityTypes },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'armsNames', label: 'اسم مصدر السلاح', type: 'multi', options: COMMON_OPTIONS.armsNames },
            { key: 'armsTypes', label: 'نوع السلاح', type: 'multi', options: COMMON_OPTIONS.armsTypes },
            { key: 'armsSymbols', label: 'رمز السلاح', type: 'multi', options: COMMON_OPTIONS.armsSymbols },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz }
        ]
    },
    {
        key: 'operationActivity',
        title: 'كشف العمليات النوعية',
        tableTitle: 'كشف العمليات النوعية',
        columns: ['المحافظة', 'القضاء', 'نوع العملية', 'النتائج', 'العدد'],
        printLayout: 'table',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'activityTypes', label: 'نوع الحدث', type: 'multi', options: COMMON_OPTIONS.activityTypes },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts },
            { key: 'mission', label: 'المهمة', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'result', label: 'النتائج', type: 'toggle', options: COMMON_OPTIONS.resultToggle },
            { key: 'armsNames', label: 'اسم مصدر السلاح', type: 'multi', options: COMMON_OPTIONS.armsNames },
            { key: 'armsTypes', label: 'نوع السلاح', type: 'multi', options: COMMON_OPTIONS.armsTypes },
            { key: 'armsSymbols', label: 'رمز السلاح', type: 'multi', options: COMMON_OPTIONS.armsSymbols }
        ]
    },
    {
        key: 'otherHandsActivitys',
        title: 'كشف أنشطة الجهات الأمنية',
        tableTitle: 'أنشطة الجهات الأمنية',
        columns: ['الجهة الأمنية', 'نوع النشاط', 'المحافظة', 'العدد'],
        printLayout: 'table',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'districts', label: 'الأقضية', type: 'multi', options: COMMON_OPTIONS.districts },
            { key: 'otherHands', label: 'الجهات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz },
            { key: 'mission', label: 'اسم المهمة أو العملية', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'activityTypes', label: 'نوع الحدث (النشاط)', type: 'multi', options: COMMON_OPTIONS.activityTypes },
            { key: 'typeOrgs', label: 'نوع التنظيم', type: 'multi', options: COMMON_OPTIONS.typeOrgs },
            { key: 'reportName', label: 'عنوان الكشف', type: 'text' }
        ]
    },
    {
        key: 'ourSidesCasualties',
        title: 'كشف خسائر القوات الأمنية والجهات الصديقة',
        tableTitle: 'خسائر القوات الأمنية والجهات الصديقة',
        columns: ['المحافظة', 'نوع الخسائر', 'العدد'],
        printLayout: 'matrix',
        filters: [
            { key: 'dateRange', label: 'تحديد بين تاريخين', type: 'date-range' },
            { key: 'cities', label: 'المحافظات', type: 'multi', options: COMMON_OPTIONS.cities },
            { key: 'orgs', label: 'التنظيمات', type: 'multi', options: COMMON_OPTIONS.orgs },
            { key: 'otherHands', label: 'القوات الأمنية', type: 'multi', options: COMMON_OPTIONS.otherHands },
            { key: 'monjaz', label: 'التبعية المنجزة', type: 'multi', options: COMMON_OPTIONS.monjaz },
            { key: 'mission', label: 'اسم المهمة أو العملية', type: 'select', options: COMMON_OPTIONS.missions },
            { key: 'ourLosses', label: 'نوع الخسائر', type: 'multi', options: COMMON_OPTIONS.ourLosses },
            { key: 'reportName', label: 'عنوان الكشف', type: 'text' }
        ]
    }
];
