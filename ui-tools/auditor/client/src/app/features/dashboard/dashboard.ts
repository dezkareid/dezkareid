import { Component, inject, OnInit, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service.ts';
import { CardComponent, TagComponent } from '@dezkareid/components/angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, TagComponent, BaseChartDirective],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>Performance Dashboard</h1>
        <div class="controls">
          <select (change)="onUrlChange($event)" aria-label="Select a URL to visualize performance data">
            <option value="">Select a URL to visualize</option>
            <option *ngFor="let url of api.urls()" [value]="url.id">{{ url.address }} ({{ url.domain?.name }})</option>
          </select>
        </div>
      </header>

      <div class="grid" *ngIf="selectedUrlId()">
        <div db-card class="full-width">
          <h3>Environment Comparison (Latest Scores)</h3>
          <div class="comparison-grid">
            <div class="env-card" *ngFor="let envData of comparisonData()">
              <div class="env-header">
                <h4>{{ envData.envName }}</h4>
                <span db-tag *ngIf="envData.hasData" [variant]="envData.inBudget ? 'success' : 'danger'">
                  {{ envData.inBudget ? 'In Budget' : 'Out of Budget' }}
                </span>
              </div>
              <div class="score" [style.color]="getScoreColor(envData.score)">
                {{ envData.score | number:'1.0-0' }}
              </div>
              <div class="metrics-list">
                <div class="metric-item">
                  <span>LCP</span>
                  <strong>{{ envData.lcp | number:'1.2-2' }}s</strong>
                </div>
                <div class="metric-item">
                  <span>TBT</span>
                  <strong>{{ envData.tbt | number:'1.0-0' }}ms</strong>
                </div>
                <div class="metric-item">
                  <span>CLS</span>
                  <strong>{{ envData.cls | number:'1.3-3' }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div db-card>
          <h3>Largest Contentful Paint (LCP)</h3>
          <div class="chart-container">
            <canvas baseChart
              [data]="lcpData()"
              [options]="chartOptions"
              [type]="'line'">
            </canvas>
          </div>
        </div>

        <div db-card>
          <h3>Total Blocking Time (TBT)</h3>
          <div class="chart-container">
            <canvas baseChart
              [data]="tbtData()"
              [options]="chartOptions"
              [type]="'line'">
            </canvas>
          </div>
        </div>

        <div db-card>
          <h3>Cumulative Layout Shift (CLS)</h3>
          <div class="chart-container">
            <canvas baseChart
              [data]="clsData()"
              [options]="chartOptions"
              [type]="'line'">
            </canvas>
          </div>
        </div>

        <div db-card>
          <h3>Performance Score</h3>
          <div class="chart-container">
            <canvas baseChart
              [data]="scoreData()"
              [options]="chartOptions"
              [type]="'line'">
            </canvas>
          </div>
        </div>
      </div>

      <div db-card *ngIf="!selectedUrlId()" class="empty-state">
        <p>Please select a URL to view historical performance data and environment comparisons.</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: var(--spacing-24);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-32);
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-24);
    }
    .full-width {
      grid-column: span 2;
    }
    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--spacing-16);
      margin-top: var(--spacing-16);
    }
    .env-card {
      padding: var(--spacing-16);
      background-color: var(--color-background-primary);
      border-radius: var(--border-radius-medium);
      text-align: center;
    }
    .env-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-8);
    }
    .env-header h4 { margin: 0; }
    .score {
      font-size: var(--font-size-800);
      font-weight: var(--font-weight-bold);
      margin: var(--spacing-8) 0;
    }
    .metrics-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      margin-top: var(--spacing-12);
    }
    .metric-item {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-200);
    }
    .chart-container {
      height: 300px;
      margin-top: var(--spacing-16);
    }
    .empty-state {
      text-align: center;
      padding: var(--spacing-64);
      color: var(--color-text-secondary);
    }
    select {
      padding: var(--spacing-8) var(--spacing-12);
      border-radius: var(--border-radius-small);
      border: 1px solid var(--color-background-secondary);
      background-color: var(--color-background-primary);
      color: var(--color-text-primary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  api = inject(ApiService);
  selectedUrlId = signal<string | null>(null);

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const }
    }
  };

  lcpData = computed(() => this.getMultiEnvChartData('LCP'));
  tbtData = computed(() => this.getMultiEnvChartData('TBT'));
  clsData = computed(() => this.getMultiEnvChartData('CLS'));
  scoreData = computed(() => this.getMultiEnvChartData('performance-score'));

  comparisonData = computed(() => {
    const urlId = this.selectedUrlId();
    if (!urlId) return [];

    return this.api.environments().map(env => {
      const latestRun = this.api.auditRuns()
        .filter(r => r.urlId === urlId && r.environmentId === env.id && r.status === 'COMPLETED')
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())[0];

      if (!latestRun) return { envName: env.name, score: 0, lcp: 0, tbt: 0, cls: 0, inBudget: true, hasData: false };

      const getMetric = (name: string) => latestRun.metrics?.find((m: any) => m.name === name)?.value || 0;

      return {
        envName: env.name,
        score: getMetric('performance-score'),
        lcp: getMetric('LCP') / 1000,
        tbt: getMetric('TBT'),
        cls: getMetric('CLS'),
        inBudget: latestRun.inBudget,
        hasData: true,
      };
    });
  });

  ngOnInit() {
    this.api.loadUrls();
    this.api.loadEnvironments();
    this.api.loadAuditRuns();
  }

  onUrlChange(event: any) {
    this.selectedUrlId.set(event.target.value || null);
  }

  getScoreColor(score: number): string {
    if (score >= 90) return '#22c55e';
    if (score >= 50) return '#d97706';
    return '#ef4444';
  }

  private getMultiEnvChartData(metricName: string): ChartConfiguration<'line'>['data'] {
    const urlId = this.selectedUrlId();
    if (!urlId) return { labels: [], datasets: [] };

    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#d97706', '#8b5cf6'];
    const datasets: any[] = [];
    let allLabels: string[] = [];

    this.api.environments().forEach((env, index) => {
      const runs = this.api.auditRuns()
        .filter(r => r.urlId === urlId && r.environmentId === env.id && r.status === 'COMPLETED')
        .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

      if (runs.length === 0) return;

      const labels = runs.map(r => new Date(r.createdAt!).toLocaleTimeString());
      if (labels.length > allLabels.length) allLabels = labels;

      datasets.push({
        data: runs.map(r => r.metrics?.find((m: any) => m.name === metricName)?.value || null),
        label: env.name,
        borderColor: colors[index % colors.length],
        tension: 0.4
      });
    });

    return { labels: allLabels, datasets };
  }
}
