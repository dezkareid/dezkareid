import { Module } from '@nestjs/common';
import { EnvironmentsService } from './environments.service.js';
import { EnvironmentsController } from './environments.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [EnvironmentsController],
  providers: [EnvironmentsService, PrismaService],
})
export class EnvironmentsModule {}
