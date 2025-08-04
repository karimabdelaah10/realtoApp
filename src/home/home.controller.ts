import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dtos/home.create.dto';
import { PropertyType } from '../../generated/prisma';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getAllHomes(
    @Query('city') city: string,
    @Query('propertyType') propertyType?: PropertyType,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    const filters = {
      city,
      propertyType,
      price: {
        gte: minPrice || 0, // Default to 0 if minPrice is not provided
        lte: maxPrice || Infinity, // Default to Infinity if maxPrice is not provided
      },
    };
    return this.homeService.getAllHomes(filters);
  }

  @Post()
  createHome(@Body() createHomeData: CreateHomeDto) {
    return this.homeService.createHome(createHomeData);
  }

  @Get(':id')
  getHomeById(@Param('id') homeId: number) {
    return this.homeService.getHomeById(homeId);
  }
}
