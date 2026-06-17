import { Module } from '@nestjs/common';

import { StoreOwnerController } from './store-owner.controller';
import { StoreOwnerService } from './store-owner.service';

import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StoreOwnerController],
  // eslint-disable-next-line prettier/prettier
  providers: [
    StoreOwnerService,
    PrismaService,
  ],
})
export class StoreOwnerModule {}
