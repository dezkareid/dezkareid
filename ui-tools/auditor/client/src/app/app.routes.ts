import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.ts';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.ts').then(m => m.DashboardComponent),
      },
      {
        path: 'audits',
        loadComponent: () => import('./features/audit-list/audit-list.ts').then(m => m.AuditListComponent),
      },
      {
        path: 'url-management',
        loadComponent: () => import('./features/url-management/url-management.ts').then(m => m.UrlManagementComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.ts').then(m => m.SettingsComponent),
      },
    ],
  },
];
