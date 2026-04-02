import {
  Component,
  OnInit,
  computed,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'db-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="theme-toggle__wrapper">
      <button
        type="button"
        class="theme-toggle"
        [class.theme-toggle--dark]="isDark()"
        (click)="toggle()"
        [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        [attr.aria-pressed]="isDark()"
      >
        <!-- Sun Icon -->
        <svg
          *ngIf="!isDark()"
          aria-hidden="true"
          class="theme-toggle__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        <!-- Moon Icon -->
        <svg
          *ngIf="isDark()"
          aria-hidden="true"
          class="theme-toggle__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>

        {{ label() }}
      </button>
      <span aria-live="polite" class="sr-only">
        {{ label() }} mode active
      </span>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ThemeToggleComponent implements OnInit {
  cssProcessor = input<'css' | 'lightningcss'>('css');
  onChange = output<'light' | 'dark'>();

  theme = signal<'light' | 'dark'>('light');
  // eslint-disable-next-line unicorn/consistent-function-scoping
  isDark = computed(() => this._isDarkTheme());
  // eslint-disable-next-line unicorn/consistent-function-scoping
  label = computed(() => this._getLabel());

  private _isDarkTheme() {
    return this.theme() === 'dark';
  }

  private _getLabel() {
    return this._isDarkTheme() ? 'Dark' : 'Light';
  }

  private readonly STORAGE_KEY = 'color-scheme';

  ngOnInit() {
    const initialThemeValue = this.getInitialTheme();
    this.theme.set(initialThemeValue);
    this.applyTheme(initialThemeValue, this.cssProcessor());
  }

  toggle() {
    const nextThemeValue: 'light' | 'dark' = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(nextThemeValue);
    this.applyTheme(nextThemeValue, this.cssProcessor());
    this.persistTheme(nextThemeValue);
    this.onChange.emit(nextThemeValue);
  }

  private getInitialTheme(): 'light' | 'dark' {
    if (globalThis.window === undefined) return 'light';
    const stored = globalThis.window.localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(targetTheme: 'light' | 'dark', processor: 'css' | 'lightningcss' = 'css'): void {
    if (globalThis.window === undefined) return;
    globalThis.window.document.documentElement.style.colorScheme = targetTheme;
    if (processor === 'lightningcss') {
      if (targetTheme === 'dark') {
        globalThis.window.document.documentElement.style.setProperty('--lightningcss-light', ' ');
        globalThis.window.document.documentElement.style.setProperty('--lightningcss-dark', 'initial');
      }
      else {
        globalThis.window.document.documentElement.style.setProperty('--lightningcss-light', 'initial');
        globalThis.window.document.documentElement.style.setProperty('--lightningcss-dark', ' ');
      }
    }
  }

  private persistTheme(themeToPersist: 'light' | 'dark'): void {
    if (globalThis.window === undefined) return;
    globalThis.window.localStorage.setItem(this.STORAGE_KEY, themeToPersist);
  }
}
