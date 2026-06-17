import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto } from './dto/rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Body() createRatingDto: CreateRatingDto, @Request() req) {
    return this.ratingsService.create(createRatingDto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @Request() req,
  ) {
    return this.ratingsService.update(id, updateRatingDto.score, req.user.id);
  }

  @Get('storeowner-dashboard')
  getStoreOwnerDashboard(@Request() req) {
    return this.ratingsService.getStoreOwnerDashboard(req.user.id);
  }

  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.ratingsService.findByStore(storeId);
  }

  @Get('user/:storeId')
  getUserRating(@Param('storeId') storeId: string, @Request() req) {
    return this.ratingsService.getUserRating(storeId, req.user.id);
  }

  @Get('my-ratings')
  getMyRatings(@Request() req) {
    return this.ratingsService.findByUser(req.user.id);
  }
}
