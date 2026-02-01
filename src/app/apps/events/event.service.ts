import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface MilitaryActivity {
    id: number;
    date_time: string;
    time_news: string;
    source_muId: number;
    additionArms: {
        symbolOrName: string;
        typeArms: { name: string };
    };
    missionName: { name: string };
    activityType: { name: string };
    the_news: string;
    organization: { orgName: { name: string } };
    otherHands: { name: string }[];
    holdingForce: string;
    typeOrgNames: { name: string }[];
    typeOrgNamesString?: string;
    file103?: {
        tripCode: string;
        tripNumber: string;
        airCraftType: { name: string };
        mode3: string;
        mode2: string;
        icao: string;
        locationTakeOff: { name: string };
        note: string;
    };
    targetJndis: { targetId: number }[];
    numberBook: string;
    country: { name: string };
    city: { name: string };
    district: { name: string };
    handDistrict: { name: string };
    neighbourhood: string;
    coordinates: Coordinate[];
    cordinatesString?: string;
    coordinateTypes?: any;
    category?: string;
    gisAuditing?: string;
    auditing?: string;
    analysisOpinion?: string;
    completionText?: string;
    proposals?: string;
    addAuditingByUser?: string;
    mu_id: number;
    nickName: string;
    createDate: {
        year: number;
        month: { value: number };
        dayOfMonth: number;
        hour: number;
        minute: number;
    };
    uploadFiles: UploadFile[];
    transfers: any[];
}

export interface Coordinate {
    id?: number;
    latitude: number;
    longitude: number;
    name: string;
    maNews?: string;
    maCoordinateImage?: string;
    mapInclude?: boolean;
    coordinateType: {
        typeName: string;
        typeImage?: string;
    };
}

export interface UploadFile {
    id: number;
    pathFile: string;
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    constructor(private http: HttpClient) {}

    // TODO: Replace with real API call
    // return this.http.get<MilitaryActivity[]>('/api/military-activities');
    getEvents(): Observable<MilitaryActivity[]> {
        const mockEvents: MilitaryActivity[] = [
            {
                id: 1,
                date_time: '2026-01-27',
                time_news: '10:00',
                source_muId: 101,
                additionArms: {
                    symbolOrName: 'وحدة 1',
                    typeArms: { name: 'نوع 1' }
                },
                missionName: { name: 'مهمة أ' },
                activityType: { name: 'نوع حدث 1' },
                the_news: 'تفاصيل الحدث الأول هنا...',
                organization: { orgName: { name: 'منظمة 1' } },
                otherHands: [{ name: 'جهة مشاركة 1' }],
                holdingForce: 'قوة ماسكة 1',
                typeOrgNames: [{ name: 'نوع منظمة 1' }],
                targetJndis: [{ targetId: 201 }],
                numberBook: 'B-123',
                country: { name: 'العراق' },
                city: { name: 'بغداد' },
                district: { name: 'الكرخ' },
                handDistrict: { name: 'المنصور' },
                neighbourhood: 'حي دراغ',
                coordinates: [
                    {
                        latitude: 33.3128,
                        longitude: 44.3615,
                        name: 'موقع 1',
                        coordinateType: { typeName: 'نوع إحداثي 1' }
                    }
                ],
                cordinatesString: '33.3128, 44.3615',
                category: 'مهم',
                gisAuditing: 'تظاف',
                mu_id: 1001,
                nickName: 'المستخدم 1',
                createDate: {
                    year: 2026,
                    month: { value: 1 },
                    dayOfMonth: 27,
                    hour: 10,
                    minute: 30
                },
                uploadFiles: [
                    { id: 1, pathFile: 'file1.jpg' },
                    { id: 2, pathFile: 'document.pdf' }
                ],
                transfers: []
            }
        ];
        return of(mockEvents);
    }

    // TODO: Implement API call for deletion
    deleteEvent(id: number): Observable<any> {
        console.log(`Deleting event ${id}`);
        return of({ success: true });
    }

    // TODO: Implement API call for transfer
    transferEvent(eventId: number, muId: number): Observable<any> {
        console.log(`Transferring event ${eventId} to unit ${muId}`);
        return of({ success: true });
    }

    // TODO: Implement API call for auditing/evaluation
    saveAuditing(event: MilitaryActivity): Observable<any> {
        console.log(`Saving auditing for event ${event.id}`, event);
        return of({ success: true });
    }
}
