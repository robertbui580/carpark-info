import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRegister, AuthRegisterResponse, AuthSignInRequest, JWTData, UserAttribute } from './auth.dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { EEnv } from '@src/common/constant/constant';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  signJwt(payload: Record<string, any>, jwtSignOptions?: JwtSignOptions) {
    return this.jwtService.sign(payload, jwtSignOptions);
  }

  verifyJwt(token: string, jwtVerifyOptions?: JwtVerifyOptions) {
    return this.jwtService.verify(token, jwtVerifyOptions);
  }

  async signIn(payload: AuthSignInRequest) {
    const user = await this.userService.findOneWithCondition({
      where: {
        username: payload.username,
      },
    });
    if (!user) {
      throw new NotFoundException('username not found');
    }

    const flag = await compare(payload.password, user.password);
    if (!flag) {
      throw new UnauthorizedException('password incorrect');
    }

    const data: JWTData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    };

    const accessToken = this.signJwt(data);
    const refreshToken = this.signJwt(data, {
      secret: this.configService.get(EEnv.JWT_REFRESH_KEY),
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async register(payload: AuthRegister) {
    const user = await this.userService.findOneWithCondition({
      where: {
        username: payload.username,
      },
    });
    if (user) {
      throw new BadRequestException('UserName exists!');
    }

    const hashedPw = await hash(payload.password, +this.configService.get(EEnv.BCRYPT_SALT_ROUNDS));
    const userData: UserAttribute = {
      username: payload.username,
      password: hashedPw,
      fullName: payload.fullName || payload.username,
    };

    const newUser = await this.userService.createNewUser(userData);
    return new AuthRegisterResponse(newUser);
  }

  async refreshToken(token: string) {
    const data: JWTData = await this.verifyJwt(token, {
      secret: this.configService.get(EEnv.JWT_REFRESH_KEY),
    });
    const user = await this.userService.findOneWithCondition({
      where: {
        id: data.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: JWTData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    };
    const accessToken = this.signJwt(payload);
    return { accessToken };
  }
}
