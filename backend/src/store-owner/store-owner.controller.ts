/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StoreOwnerService } from './store-owner.service';

@Controller('store-owner')
@UseGuards(JwtAuthGuard)
export class StoreOwnerController {
  constructor(
    private readonly storeOwnerService: StoreOwnerService,
  ) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.storeOwnerService.getDashboard(
      req.user.id,
    );
  }
}
