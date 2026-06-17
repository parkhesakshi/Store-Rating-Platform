import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN', 'STORE_OWNER'])
  role?: 'USER' | 'ADMIN' | 'STORE_OWNER';
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one uppercase letter and one special character',
  })
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  address?: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN', 'STORE_OWNER'])
  role?: 'USER' | 'ADMIN' | 'STORE_OWNER';
}