// eslint-disable-next-line prettier/prettier
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto, userId: string) {
    const { storeId, score } = createRatingDto;

    // Check if store exists
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check if user already rated this store
    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this store');
    }

    return this.prisma.rating.create({
      data: {
        score,
        userId,
        storeId,
      },
    });
  }

  async update(id: string, score: number, userId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.userId !== userId) {
      throw new ForbiddenException('You can only update your own ratings');
    }

    return this.prisma.rating.update({
      where: { id },
      data: { score },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.rating.findMany({
      where: { userId },
      include: {
        store: true,
      },
    });
  }

  async findByStore(storeId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { storeId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const average =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : 0;

    return { ratings, average, total: ratings.length };
  }

  async getStoreOwnerDashboard(userId: string) {
    const store = await this.prisma.store.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!store) {
      throw new NotFoundException('No store assigned to this owner');
    }

    const ratings = await this.prisma.rating.findMany({
      where: {
        storeId: store.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.score, 0) /
          ratings.length
        : 0;

    return {
      storeId: store.id,
      storeName: store.name,
      averageRating,
      totalRatings: ratings.length,
      ratings,
    };
  }

  async getUserRating(storeId: string, userId: string) {
    return this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });
  }
}
