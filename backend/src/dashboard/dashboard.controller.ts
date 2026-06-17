import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('public-stats')
  async getPublicStats() {
    return this.dashboardService.getPublicStats();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getStats() {
    return this.dashboardService.getStats();
  }
}