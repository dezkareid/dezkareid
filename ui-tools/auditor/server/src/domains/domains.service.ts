import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Domain } from '../generated/prisma/index.js';
import { CreateDomainDto } from './dto/create-domain.dto.js';
import { UpdateDomainDto } from './dto/update-domain.dto.js';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDomainDto): Promise<Domain> {
    return this.prisma.domain.create({ data });
  }

  async findAll(): Promise<Domain[]> {
    return this.prisma.domain.findMany({ include: { urls: true } });
  }

  async findOne(id: string): Promise<Domain | null> {
    return this.prisma.domain.findUnique({ where: { id }, include: { urls: true } });
  }

  async update(id: string, data: UpdateDomainDto): Promise<Domain> {
    return this.prisma.domain.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Domain> {
    return this.prisma.domain.delete({ where: { id } });
  }
}
