import { IsInt, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  storeId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}

export class UpdateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
