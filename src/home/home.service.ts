import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeDto } from './dtos/home.create.dto';
import { HomeResponseDto } from './dtos/home.response.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllHomes(filters: any): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany();
    return homes.map((home) => new HomeResponseDto(home));
  }

  async createHome(createHomeData: CreateHomeDto) {
    console.log(createHomeData);
    const realtorExists = await this.prismaService.user.findFirst({
      where: {
        id: createHomeData.realtorId,
      },
    });
    if (!realtorExists) {
      return {
        code: 404,
        message: 'Realtor not found',
      };
    }
    const createdHome = await this.prismaService.home.create({
      data: {
        address: createHomeData.address,
        numberOfRooms: createHomeData.numberOfRooms,
        numberOfBathrooms: createHomeData.numberOfBathrooms,
        city: createHomeData.city,
        price: createHomeData.price,
        landSize: createHomeData.landSize,
        propertyType: createHomeData.propertyType,
        realtorId: createHomeData.realtorId,
      },
    });
    return {
      code: 200,
      createdHome,
      message: 'Home Created successfully',
    };
  }

  updateHome() {}

  deleteHome() {}

  getHomeById(homeId: number) {
    return this.prismaService.home.findFirst({
      where: {
        id: homeId,
      },
    });
  }
}
