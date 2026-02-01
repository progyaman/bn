import {Component, computed, inject} from '@angular/core';
import {LayoutService} from '@/layout/service/layout.service';

@Component({
    selector: '[app-footer]',
    standalone: true,
    template: `
        <div class="layout-footer">
            <div class="footer-logo-container">
                <img src="/images/app/bn.png" alt="bn"/>
                <span class="footer-app-name">bn</span>
            </div>
            <span class="footer-copyright">&#169; Your Organization - 2025</span>
        </div>
    `
})
export class AppFooter {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
