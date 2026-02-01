import { Component, Input } from '@angular/core';

@Component({
    selector: 'auth-logo-widget',
    standalone: true,
    template: `
        <img
            src="/images/app/bn.png"
            alt="BN"
            width="96"
            height="96"
            [class]="className"
        />
    `
})
export class AuthLogoWidget {
    @Input() className: string = '';
}
