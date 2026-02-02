import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-events-check',
    standalone: true,
    imports: [CommonModule, DividerModule],
    templateUrl: './check.html',
    styleUrls: ['./check.scss']
})
export class EventsCheck {}
