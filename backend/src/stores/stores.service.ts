import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { Role } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto, ownerId: string) {
    return this.prisma.store.create({
      data: {
        ...createStoreDto,
        ownerId,
      },
    });
  }

  async findAll(filters?: { name?: string; address?: string }) {
    const where: any = {};

    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters?.address) {
      where.address = {
        contains: filters.address,
        mode: 'insensitive',
      };
    }

    const stores = await this.prisma.store.findMany({
      where,
      include: {
        ratings: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return stores.map((store) => ({
      ...store,
      averageRating:
        store.ratings.length > 0
          ? store.ratings.reduce((sum, rating) => sum + rating.score, 0) /
            store.ratings.length
          : 0,
      totalRatings: store.ratings.length,
    }));
  }

  async findOne(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        owner: {
          select: {
            name: true,
            email: true,
            address: true,
            ratings: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  // eslint-disable-next-line prettier/prettier
  async update(
    id: string,
    updateStoreDto: UpdateStoreDto,
    userId: string,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (store.ownerId !== userId && user.role !== Role.ADMIN) {
      // eslint-disable-next-line prettier/prettier
      throw new ForbiddenException(
        'You can only update your own store',
      );
    }

    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
    });
  }

  async delete(id: string, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (store.ownerId !== userId && user.role !== Role.ADMIN) {
      // eslint-disable-next-line prettier/prettier
      throw new ForbiddenException(
       ` 'You can only delete your own store'`,
      );
    }

    return this.prisma.store.delete({
      where: { id },
    });
  }
}