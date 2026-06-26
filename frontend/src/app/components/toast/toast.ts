import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  template: `
    <!-- Floating toast container -->
    <div class="fixed bottom-5 right-5 z-9999 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          [class]="getToastClasses(toast.type)"
        >
          <!-- Toast Icon & Message -->
          <div class="flex items-center gap-2.5">
            <!-- Success Icon -->
            @if (toast.type === 'success') {
              <svg class="h-4.5 w-4.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            <!-- Error Icon -->
            @if (toast.type === 'error') {
              <svg class="h-4.5 w-4.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            <!-- Info Icon -->
            @if (toast.type === 'info') {
              <svg class="h-4.5 w-4.5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }

            <!-- Message text -->
            <span class="text-xs font-semibold text-[#37352f] leading-snug">{{ toast.message }}</span>
          </div>

          <!-- Close button -->
          <button 
            (click)="toastService.remove(toast.id)"
            class="text-[#787774] hover:text-[#37352f] p-0.5 rounded hover:bg-[rgba(55,53,47,0.06)] transition-all cursor-pointer"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(type: string): string {
    const base = 'pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded border shadow-[rgba(15,15,15,0.08)_0px_8px_24px] bg-white animate-slide-in ';
    switch (type) {
      case 'success':
        return base + 'border-emerald-200';
      case 'error':
        return base + 'border-rose-200';
      case 'info':
      default:
        return base + 'border-[rgba(55,53,47,0.16)]';
    }
  }
}
