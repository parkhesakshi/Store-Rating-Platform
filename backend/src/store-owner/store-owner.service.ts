/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoreOwnerService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(ownerId: string) {
    const store = await this.prisma.store.findFirst({
      where: {
        ownerId,
      },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
      };
    }

    const averageRating =
      store.ratings.length > 0
       
        ? store.ratings.reduce(
            (sum, rating) => sum + rating.score,
            0,
          ) / store.ratings.length
        : 0;

    return {
      storeId: store.id,
      storeName: store.name,
      averageRating: Number(
        averageRating.toFixed(1),
      ),
      totalRatings: store.ratings.length,
      ratings: store.ratings,
    };
  }
}