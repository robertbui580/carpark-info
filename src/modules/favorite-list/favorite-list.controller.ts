import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FavoriteListService } from './favorite-list.service';
import { User } from '@src/common/guard/guard.decorator';
import { AddFavoriteCarpark, ListFavoriteCarpark } from './favorite-list.dto';

@Controller('favorite-list')
@ApiTags('Favorite List')
@ApiBearerAuth()
export class FavoriteListController {
  constructor(private readonly favoriteListService: FavoriteListService) {}

  @Post()
  addNewFavoriteCarpark(@User() user, @Body() body: AddFavoriteCarpark) {
    const userId = user?.id;
    return this.favoriteListService.addNewFavoriteCarpark(userId, body);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getMyFavoriteCarpark(@User() user, @Query() query: ListFavoriteCarpark) {
    const userId = user?.id;
    return this.favoriteListService.getMyFavoriteCarpark(userId, query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAFavoriteCarpark(@User() user, @Param('id') id: number) {
    return this.favoriteListService.deleteAFavoriteCarpark(user?.id, id);
  }
}
