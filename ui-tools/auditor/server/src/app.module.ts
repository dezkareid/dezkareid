import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { DomainsModule } from './domains/domains.module.js';
import { EnvironmentsModule } from './environments/environments.module.js';
import { UrlsModule } from './urls/urls.module.js';
import { AuditModule } from './audit/audit.module.js';
import { CleanupModule } from './cleanup/cleanup.module.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DomainsModule,
    EnvironmentsModule,
    UrlsModule,
    AuditModule,
    CleanupModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
