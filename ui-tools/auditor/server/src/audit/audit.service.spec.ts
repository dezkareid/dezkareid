import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../audit/audit.service.js';
import { PrismaService } from '../prisma.service.js';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: PrismaService,
          useValue: {
            url: { findUnique: jest.fn() },
            environment: { findUnique: jest.fn() },
            auditRun: { create: jest.fn(), update: jest.fn() },
            metric: { createMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
