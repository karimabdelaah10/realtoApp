import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dtos/home.create.dto';
import { PropertyType, UserType } from '../../generated/prisma';
import { User, UserInfo } from '../user/decorators/user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getAllHomes(
    @Query('city') city: string,
    @Query('propertyType', new ParseEnumPipe(PropertyType))
    propertyType?: PropertyType,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          }
        : undefined;
    const filters = {
      ...(city && { city }),
      ...(propertyType && { propertyType }),
      ...(price && { price }),
    };
    return this.homeService.getAllHomes(filters);
  }

  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard)
  @Post()
  createHome(@Body() createHomeData: CreateHomeDto, @User() user: UserInfo) {
    return ' This is a placeholder for the createHome method. ';
    // return this.homeService.createHome(createHomeData, user.id);
  }

  @Get(':id')
  getHomeById(@Param('id') homeId: number) {
    return this.homeService.getHomeById(homeId);
  }

  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) homeId: number) {
    return this.homeService.deleteHome(homeId);
  }
}
