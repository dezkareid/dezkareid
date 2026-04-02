import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '@dezkareid/components/angular';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar__header">
          <span class="sidebar__title">Auditor</span>
        </div>
        <nav class="sidebar__nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="sidebar__link">Dashboard</a>
          <a routerLink="/audits" routerLinkActive="active" class="sidebar__link">Recent Audits</a>
          <a routerLink="/url-management" routerLinkActive="active" class="sidebar__link">URL Management</a>
          <a routerLink="/settings" routerLinkActive="active" class="sidebar__link">Settings</a>
        </nav>
        <div class="sidebar__footer">
          <db-theme-toggle></db-theme-toggle>
        </div>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    .sidebar {
      width: 260px;
      background-color: var(--color-background-secondary);
      border-right: 1px solid var(--color-background-secondary);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .sidebar__header {
      padding: var(--spacing-24);
      border-bottom: 1px solid var(--color-background-primary);
    }
    .sidebar__title {
      font-size: var(--font-size-500);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
    }
    .sidebar__nav {
      flex: 1;
      padding: var(--spacing-16) 0;
      display: flex;
      flex-direction: column;
    }
    .sidebar__link {
      padding: var(--spacing-12) var(--spacing-24);
      text-decoration: none;
      color: var(--color-text-secondary);
      transition: background-color 0.2s, color 0.2s;
    }
    .sidebar__link:hover {
      background-color: var(--color-background-primary);
      color: var(--color-text-primary);
    }
    .sidebar__link.active {
      background-color: var(--color-background-primary);
      color: var(--color-primary);
      border-left: 4px solid var(--color-primary);
    }
    .sidebar__footer {
      padding: var(--spacing-24);
      border-top: 1px solid var(--color-background-primary);
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      background-color: var(--color-background-primary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
