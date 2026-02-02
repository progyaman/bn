import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-events-refused',
    standalone: true,
    imports: [CommonModule, DividerModule],
    templateUrl: './refused.html',
    styleUrls: ['./refused.scss']
})
export class EventsRefused {}
