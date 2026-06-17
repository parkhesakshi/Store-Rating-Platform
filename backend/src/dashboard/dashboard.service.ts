import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.store.count(),
      this.prisma.rating.count(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }

  async getPublicStats() {
    const users = await this.prisma.user.count({
      where: {
        role: 'USER',
      },
    });

    const stores = await this.prisma.store.count();

    const ratings = await this.prisma.rating.count();

    return {
      users,
      stores,
      ratings,
    };
  }
}
