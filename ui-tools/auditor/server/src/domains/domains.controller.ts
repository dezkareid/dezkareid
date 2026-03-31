import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DomainsService } from './domains.service.js';
import { CreateDomainDto } from './dto/create-domain.dto.js';
import { UpdateDomainDto } from './dto/update-domain.dto.js';

@Controller('domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post()
  create(@Body() createDomainDto: CreateDomainDto) {
    return this.domainsService.create(createDomainDto);
  }

  @Get()
  findAll() {
    return this.domainsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.domainsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto) {
    return this.domainsService.update(id, updateDomainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.domainsService.remove(id);
  }
}
