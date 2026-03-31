import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  providers: [CleanupService, PrismaService],
})
export class CleanupModule {}
