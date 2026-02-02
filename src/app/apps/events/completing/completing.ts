import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-events-completing',
    standalone: true,
    imports: [CommonModule, DividerModule],
    templateUrl: './completing.html',
    styleUrls: ['./completing.scss']
})
export class EventsCompleting {}
