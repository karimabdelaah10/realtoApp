import { PropertyType } from '../../../generated/prisma';
import { Exclude, Expose } from 'class-transformer';

export class HomeResponseDto {
  id: number;
  address: string;
  numberOfRooms: number;
  numberOfBathrooms: number;
  city: string;
  @Exclude()
  price: number;

  @Expose({ name: 'price' })
  Price() {
    const newPrice = this.price + 15242;
    return `$${newPrice.toLocaleString()}`;
  }

  landSize: number;
  propertyType: PropertyType;
  @Exclude()
  createdAt: Date;

  @Expose({ name: 'created_At' })
  created_At() {
    return this.createdAt.toLocaleDateString();
  }

  @Exclude()
  updatedAt: Date;
  @Exclude()
  realtorId: number;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
