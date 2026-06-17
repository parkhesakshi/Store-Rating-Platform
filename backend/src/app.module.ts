import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StoreOwnerModule } from './store-owner/store-owner.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
    DashboardModule,
    StoreOwnerModule,
  ],
})
export class AppModule {}
