import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Environment } from '../generated/prisma/index.js';
import { CreateEnvironmentDto } from './dto/create-environment.dto.js';
import { UpdateEnvironmentDto } from './dto/update-environment.dto.js';

@Injectable()
export class EnvironmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEnvironmentDto): Promise<Environment> {
    return this.prisma.environment.create({ data });
  }

  async findAll(): Promise<Environment[]> {
    return this.prisma.environment.findMany();
  }

  async findOne(id: string): Promise<Environment | null> {
    return this.prisma.environment.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateEnvironmentDto): Promise<Environment> {
    return this.prisma.environment.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Environment> {
    return this.prisma.environment.delete({ where: { id } });
  }
}
