import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum PropertyType {
  RESIDENTIAL = 'RESIDENTIAL',
  CONDO = 'CONDO',
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfRooms: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  landSize: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNumber()
  @IsNotEmpty()
  realtorId: number;
}
