import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicApi } from '@src/common/guard/guard.decorator';
import { AuthRefreshToken, AuthRegister, AuthSignInRequest } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @PublicApi()
  signIn(@Body() body: AuthSignInRequest) {
    return this.authService.signIn(body);
  }

  @Post('register')
  @PublicApi()
  @UseInterceptors(ClassSerializerInterceptor)
  register(@Body() body: AuthRegister) {
    return this.authService.register(body);
  }

  @Post('refresh-token')
  @PublicApi()
  refreshToken(@Body() body: AuthRefreshToken) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
