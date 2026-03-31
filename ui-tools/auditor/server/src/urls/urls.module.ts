import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service.js';
import { UrlsController } from './urls.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [UrlsController],
  providers: [UrlsService, PrismaService],
})
export class UrlsModule {}
