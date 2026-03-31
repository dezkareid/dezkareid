import { Component, OnInit, signal, output, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-toggle',
  imports: [CommonModule],
  template: `
    <div class="theme-toggle__wrapper">
      <button
        type="button"
        class="theme-toggle"
        [class.theme-toggle--dark]="theme() === 'dark'"
        (click)="toggle()"
        [attr.aria-label]="'Switch to ' + (theme() === 'light' ? 'dark' : 'light') + ' mode'"
      >
        <svg
          *ngIf="theme() === 'light'"
          class="theme-toggle__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg
          *ngIf="theme() === 'dark'"
          class="theme-toggle__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span>{{ theme() === 'light' ? 'Light' : 'Dark' }} Mode</span>
      </button>
      <span class="sr-only" aria-live="polite">
        Theme changed to {{ theme() }} mode
      </span>
    </div>
  `,
  styleUrl: './theme-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent implements OnInit {
  theme = signal<Theme>('light');
  changed = output<Theme>();

  constructor() {
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  ngOnInit() {
    this.theme.set(this.getInitialTheme());
  }

  toggle() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.persistTheme(next);
    this.changed.emit(next);
  }

  private getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('color-scheme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme) {
    if (typeof window === 'undefined') return;
    document.documentElement.style.colorScheme = theme;
  }

  private persistTheme(theme: Theme) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('color-scheme', theme);
  }
}
