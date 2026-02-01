import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

export interface EventTypeAction {
    id: string;
    label: string;
    icon: string;
    color: string;
}

@Component({
    selector: 'app-event-type-sidebar',
    standalone: true,
    imports: [CommonModule, TooltipModule],
    template: `
        <div class="fixed right-2 top-[50%] -translate-y-1/2 z-[1200] flex flex-col gap-3 p-2 bg-white/60 dark:bg-surface-900/60 backdrop-blur-lg rounded-full border border-sky-100 dark:border-sky-800 shadow-2xl transition-all duration-500 side-nav-container">
            <button 
                *ngFor="let item of actions; let i = index"
                class="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 hover:scale-125 active:scale-95 group relative mb-1"
                [ngClass]="activeId === item.id ? 'scale-110 shadow-lg active-item' : 'text-surface-600 dark:text-surface-300 hover:bg-white/80 dark:hover:bg-surface-800/80'"
                [style.--active-color]="item.color"
                [style.animation]="'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'"
                [style.animation-delay]="(i * 100) + 'ms'"
                (click)="onAction(item.id)"
                [pTooltip]="item.label"
                tooltipPosition="left"
            >
                <!-- Selection Background (Gradient) -->
                <div class="absolute inset-0 rounded-full transition-all duration-500"
                     [style.background]="activeId === item.id ? 'linear-gradient(135deg, ' + item.color + ', ' + item.color + 'dd)' : 'transparent'"
                     [class.opacity-100]="activeId === item.id"
                     [class.opacity-0]="activeId !== item.id">
                </div>

                <!-- Icon -->
                <i [class]="item.icon + ' text-xl relative z-10 transition-all duration-500'" 
                   [style.color]="activeId === item.id ? '#ffffff' : item.color"
                   [class.rotate-[360deg]]="activeId === item.id"></i>
                
                <!-- Glow Effect -->
                <div class="glow-effect" *ngIf="activeId === item.id" [style.background-color]="item.color"></div>
            </button>
        </div>
    `,
    styles: [`
        :host {
            display: block;
        }

        .side-nav-container {
            animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .nav-item {
            opacity: 0;
            animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .active-item {
            animation: subtlePulse 2s infinite;
        }

        .glow-effect {
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            opacity: 0.4;
            filter: blur(8px);
            z-index: 0;
            animation: pulseGlow 2s infinite;
        }

        @keyframes slideInRight {
            from { transform: translate(100%, -50%); opacity: 0; }
            to { transform: translate(0, -50%); opacity: 1; }
        }

        @keyframes bounceIn {
            from { transform: scale(0.3); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        @keyframes subtlePulse {
            0% { box-shadow: 0 0 0 0 var(--active-color); opacity: 0.9; }
            70% { box-shadow: 0 0 0 15px transparent; opacity: 1; }
            100% { box-shadow: 0 0 0 0 transparent; opacity: 0.9; }
        }

        @keyframes pulseGlow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        button {
            border: none;
            cursor: pointer;
            outline: none;
            background: transparent;
        }

        /* Support for smaller screens */
        @media (max-width: 768px) {
            .fixed {
                right: 0.25rem;
                padding: 0.15rem;
                gap: 0.25rem;
            }
            button {
                width: 2.8rem;
                height: 2.8rem;
            }
            i {
                font-size: 1.1rem !important;
            }
        }
    `]
})
export class EventTypeSidebarComponent {
    @Input() activeId: string = 'activity';
    @Output() actionClicked = new EventEmitter<string>();

    actions: EventTypeAction[] = [
        { id: 'activity', label: 'نشاط', icon: 'pi pi-bolt', color: '#f59e0b' },
        { id: 'recent', label: 'حديث', icon: 'pi pi-history', color: '#3b82f6' },
        { id: 'known', label: 'معلوم', icon: 'pi pi-info-circle', color: '#10b981' },
        { id: 'observed', label: 'مشاهد', icon: 'pi pi-eye', color: '#8b5cf6' },
        { id: 'report', label: 'تقرير', icon: 'pi pi-file-pdf', color: '#ef4444' }
    ];

    onAction(id: string) {
        this.activeId = id;
        this.actionClicked.emit(id);
    }

    // Helper to get selected label
    getSelectedLabel(): string {
        return this.actions.find(a => a.id === this.activeId)?.label || '';
    }
}
