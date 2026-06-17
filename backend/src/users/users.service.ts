// eslint-disable-next-line prettier/prettier
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, address, role } = createUserDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAll(filters?: { search?: string }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        ratings: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
          },
        },
        ratings: {
          select: {
            id: true,
            score: true,
            storeId: true,
            store: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getStoreOwners() {
    return this.prisma.user.findMany({
      where: {
        role: 'STORE_OWNER',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user's ratings and stores first (cascade will handle this if set up)
    await this.prisma.rating.deleteMany({
      where: { userId: id },
    });

    await this.prisma.store.deleteMany({
      where: { ownerId: id },
    });

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updatePassword(id: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async getStoreOwnersWithRatings() {
    const users = await this.prisma.user.findMany({
      where: { role: 'STORE_OWNER' },
      include: {
        stores: {
          include: {
            ratings: true,
          },
        },
      },
    });

    // Calculate average rating for each store owner
    return users.map((user) => {
      const allRatings = user.stores.flatMap((store) => store.ratings);
      // eslint-disable-next-line prettier/prettier
      const totalRating = allRatings.reduce(
        (sum, rating) => sum + rating.score,
        0,
      );
      // eslint-disable-next-line prettier/prettier
      const averageRating =
        allRatings.length > 0 ? totalRating / allRatings.length : 0;

      return {
        ...user,
        password: undefined,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    });
  }
}
