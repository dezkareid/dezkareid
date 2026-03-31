import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Url } from '../generated/prisma/index.js';
import { CreateUrlDto } from './dto/create-url.dto.js';
import { UpdateUrlDto } from './dto/update-url.dto.js';

@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUrlDto): Promise<Url> {
    return this.prisma.url.create({ data });
  }

  async findAll(): Promise<Url[]> {
    return this.prisma.url.findMany({ include: { domain: true, budgets: true } });
  }

  async findOne(id: string): Promise<Url | null> {
    return this.prisma.url.findUnique({ where: { id }, include: { domain: true, budgets: true } });
  }

  async update(id: string, data: UpdateUrlDto): Promise<Url> {
    return this.prisma.url.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Url> {
    return this.prisma.url.delete({ where: { id } });
  }
}
