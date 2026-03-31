import { Injectable, Logger } from '@nestjs/common';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { PrismaService } from '../prisma.service.js';
import { AuditRun, Budget } from '../generated/prisma/index.js';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async runAudit(urlId: string, environmentId: string): Promise<AuditRun> {
    const url = await this.prisma.url.findUnique({
      where: { id: urlId },
      include: { domain: true, budgets: true },
    });
    const environment = await this.prisma.environment.findUnique({
      where: { id: environmentId },
    });

    if (!url || !environment) {
      throw new Error('URL or Environment not found');
    }

    const fullUrl = this.getFullUrl(url.address, environment.urlPrefix);

    this.logger.log(`Starting audit for: ${fullUrl} in ${environment.name} environment`);

    const auditRun = await this.prisma.auditRun.create({
      data: {
        urlId: url.id,
        environmentId: environment.id,
        status: 'PENDING',
        startedAt: new Date(),
      },
    });

    try {
      const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
      });

      const options = {
        logLevel: 'info' as const,
        output: 'json' as const,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: chrome.port,
        throttlingMethod: 'simulate' as const,
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675,
          cpuSlowdownMultiplier: 4,
        },
      };

      const result = await lighthouse(fullUrl, options);
      
      await chrome.kill();

      if (!result || !result.lhr) {
        throw new Error('Lighthouse audit failed to return a result');
      }

      const metrics = this.parseLighthouseResult(result.lhr);
      const inBudget = this.validateBudgets(metrics, url.budgets || []);

      await this.prisma.metric.createMany({
        data: metrics.map(m => ({
          ...m,
          auditRunId: auditRun.id,
        })),
      });
      
      return await this.prisma.auditRun.update({
        where: { id: auditRun.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          inBudget,
        },
      });

    } catch (error: any) {
      this.logger.error(`Audit failed for ${fullUrl}: ${error.message}`);
      return await this.prisma.auditRun.update({
        where: { id: auditRun.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
        },
      });
    }
  }

  private getFullUrl(address: string, prefix: string | null): string {
    if (!prefix) return address;
    const cleanPrefix = prefix.replace(/\/$/, '');
    const cleanAddress = address.startsWith('/') ? address : `/${address}`;
    return `${cleanPrefix}${cleanAddress}`;
  }

  private parseLighthouseResult(lhr: any) {
    const metrics = [];

    // Categories Scores
    for (const categoryId in lhr.categories) {
      const category = lhr.categories[categoryId];
      if (category && category.score !== null) {
        metrics.push({
          name: `${categoryId}-score`,
          value: category.score * 100,
          unit: 'score',
          category: categoryId,
        });
      }
    }

    // Performance Audits
    const perfAudits = [
      { key: 'first-contentful-paint', name: 'FCP', unit: 'ms' },
      { key: 'largest-contentful-paint', name: 'LCP', unit: 'ms' },
      { key: 'total-blocking-time', name: 'TBT', unit: 'ms' },
      { key: 'cumulative-layout-shift', name: 'CLS', unit: 'unitless' },
      { key: 'speed-index', name: 'Speed Index', unit: 'ms' },
      { key: 'interactive', name: 'Time to Interactive', unit: 'ms' },
    ];

    for (const audit of perfAudits) {
      const auditResult = lhr.audits[audit.key];
      if (auditResult && auditResult.numericValue !== undefined) {
        metrics.push({
          name: audit.name,
          value: auditResult.numericValue,
          unit: audit.unit,
          category: 'performance',
        });
      }
    }

    return metrics;
  }

  private validateBudgets(metrics: any[], budgets: Budget[]): boolean {
    if (budgets.length === 0) return true;

    for (const budget of budgets) {
      const metric = metrics.find(m => m.name === budget.metricName);
      if (metric && this.isBudgetExceeded(metric.value, budget)) {
        return false;
      }
    }
    return true;
  }

  private isBudgetExceeded(value: number, budget: Budget): boolean {
    switch (budget.operator) {
      case 'LT': return value >= budget.threshold;
      case 'GT': return value <= budget.threshold;
      case 'LTE': return value > budget.threshold;
      case 'GTE': return value < budget.threshold;
      default: return false;
    }
  }
}
