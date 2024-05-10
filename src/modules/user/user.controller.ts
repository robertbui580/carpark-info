import { ClassSerializerInterceptor, Controller, Get, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@src/common/guard/guard.decorator';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  getMe(@User() user) {
    const userId = user?.id;
    return this.userService.getUserInfo(userId);
  }
}
