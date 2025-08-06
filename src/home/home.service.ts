import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeDto } from './dtos/home.create.dto';
import { HomeResponseDto } from './dtos/home.response.dto';
import { PropertyType } from '../../generated/prisma';

interface GetHomesFilters {
  city?: string;
  propertyType?: PropertyType;
  price?: {
    gte?: number;
    lte?: number;
  };
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllHomes(filters: GetHomesFilters): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      where: filters,
    });
    return homes.map((home) => new HomeResponseDto(home));
  }

  async createHome(createHomeData: CreateHomeDto, realtorId: number) {
    const realtorExists = await this.prismaService.user.findFirst({
      where: {
        id: realtorId,
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
        realtorId: realtorId,
      },
    });
    const homeImages = createHomeData.images.map((image) => {
      return { ...image, homeId: createdHome.id };
    });
    await this.prismaService.image.createMany({
      data: homeImages,
    });
    return {
      code: 200,
      createdHome,
      message: 'Home Created successfully',
    };
  }

  updateHome() {}

  getHomeById(homeId: number) {
    return this.prismaService.home.findFirst({
      where: {
        id: homeId,
      },
    });
  }

  async deleteHome(homeId: number) {
    const homeExists = await this.prismaService.home.findFirst({
      where: {
        id: homeId,
      },
    });
    if (!homeExists) {
      return {
        code: 404,
        message: 'Home not found',
      };
    }
    const deleteQuires = [
      this.prismaService.image.deleteMany({
        where: {
          homeId: homeId,
        },
      }),
      this.prismaService.home.delete({
        where: {
          id: homeId,
        },
      }),
    ];

    await this.prismaService.$transaction(deleteQuires);
    return {
      code: 200,
      message: 'Home deleted successfully',
    };
  }
}
