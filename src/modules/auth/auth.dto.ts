import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/models/user.model';
import { toTrimString } from '@src/shared/util';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsJWT, IsNotEmpty, IsOptional, IsString, NotContains } from 'class-validator';

export interface UserAttribute {
  username: string;
  password: string;
  fullName: string;
}

export interface JWTData {
  id: number;
  username: string;
  fullName: string;
}

export class AuthSignInRequest {
  @ApiProperty()
  @Transform(toTrimString)
  @NotContains(' ')
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @Transform(toTrimString)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthRegister extends AuthSignInRequest {
  @ApiProperty()
  @Transform(toTrimString)
  @IsString()
  @IsOptional()
  fullName: string;
}

@Exclude()
export class AuthRegisterResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  createdAt: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export class AuthRefreshToken {
  @ApiProperty()
  @Transform(toTrimString)
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
