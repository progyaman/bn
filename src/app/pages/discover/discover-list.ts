import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DISCOVER_REPORTS } from './discover.data';

@Component({
    selector: 'app-discover-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    templateUrl: './discover-list.html',
    styleUrl: './discover-list.scss'
})
export class DiscoverListPage {
    reports = DISCOVER_REPORTS;
}
