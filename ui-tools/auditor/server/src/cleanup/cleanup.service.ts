import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldAudits() {
    this.logger.log('Starting cleanup of old audit runs...');
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const result = await this.prisma.auditRun.deleteMany({
      where: {
        createdAt: {
          lt: sixtyDaysAgo,
        },
      },
    });

    this.logger.log(`Cleanup finished. Removed ${result.count} old audit runs.`);
  }
}
