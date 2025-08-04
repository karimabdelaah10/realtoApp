import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  mobile: string;
}
