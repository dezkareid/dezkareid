import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service.ts';
import { CardComponent } from '../../shared/components/card/card.ts';
import { TagComponent } from '../../shared/components/tag/tag.ts';
import { ButtonComponent } from '../../shared/components/button/button.ts';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [CommonModule, CardComponent, TagComponent, ButtonComponent],
  template: `
    <div class="audit-list">
      <header class="header">
        <h1>Recent Audits</h1>
        <app-button (click)="api.loadAuditRuns()">Refresh</app-button>
      </header>

      <app-card>
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>URL</th>
              <th>Env</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let run of api.auditRuns()">
              <td>{{ run.createdAt | date:'short' }}</td>
              <td>{{ run.url?.address }}</td>
              <td>
                <app-tag variant="success">{{ run.environment?.name }}</app-tag>
              </td>
              <td>
                <app-tag [variant]="getStatusVariant(run.status)">
                  {{ run.status }}
                </app-tag>
              </td>
              <td>
                <app-tag *ngIf="run.status === 'COMPLETED'" [variant]="run.inBudget ? 'success' : 'danger'">
                  {{ run.inBudget ? 'In Budget' : 'Out of Budget' }}
                </app-tag>
              </td>
              <td>
                <app-button size="sm" variant="secondary" *ngIf="run.status === 'COMPLETED'">View Report</app-button>
              </td>
            </tr>
          </tbody>
        </table>
      </app-card>
    </div>
  `,
  styles: [`
    .audit-list {
      padding: var(--spacing-24);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-32);
    }
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table th {
      text-align: left;
      padding: var(--spacing-12);
      border-bottom: 2px solid var(--color-background-primary);
      color: var(--color-text-secondary);
      font-size: var(--font-size-200);
    }
    .table td {
      padding: var(--spacing-12);
      border-bottom: 1px solid var(--color-background-primary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditListComponent implements OnInit {
  api = inject(ApiService);

  ngOnInit() {
    this.api.loadAuditRuns();
  }

  getStatusVariant(status: string) {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'FAILED': return 'danger';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  }
}
