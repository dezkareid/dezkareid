import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service.js';
import { DomainsController } from './domains.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [DomainsController],
  providers: [DomainsService, PrismaService],
})
export class DomainsModule {}
