import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles('ADMIN', 'STORE_OWNER')
  create(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    return this.storesService.create(createStoreDto, req.user.id);
  }

  @Get()
  findAll(@Query('name') name?: string, @Query('address') address?: string) {
    return this.storesService.findAll({ name, address });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN', 'STORE_OWNER')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto, @Request() req) {
    return this.storesService.update(id, updateStoreDto, req.user.id);
  }

  @Delete(':id')
  @Roles('ADMIN', 'STORE_OWNER')
  remove(@Param('id') id: string, @Request() req) {
    return this.storesService.delete(id, req.user.id);
  }
}