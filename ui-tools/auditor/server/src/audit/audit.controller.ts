import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuditService } from './audit.service.js';
import { TriggerAuditDto } from './dto/trigger-audit.dto.js';
import { PrismaService } from '../prisma.service.js';

@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly prisma: PrismaService
  ) {}

  @Post('trigger')
  triggerAudit(@Body() triggerAuditDto: TriggerAuditDto) {
    // Run audit in background (not awaiting it for the response)
    this.auditService.runAudit(triggerAuditDto.urlId, triggerAuditDto.environmentId);
    return { message: 'Audit triggered successfully' };
  }

  @Get('runs')
  findAll() {
    return this.prisma.auditRun.findMany({
      include: { url: true, environment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('runs/:id')
  findOne(@Param('id') id: string) {
    return this.prisma.auditRun.findUnique({
      where: { id },
      include: { url: true, environment: true, metrics: true },
    });
  }

  @Get('url/:urlId')
  findByUrl(@Param('urlId') urlId: string) {
    return this.prisma.auditRun.findMany({
      where: { urlId },
      include: { environment: true, metrics: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
