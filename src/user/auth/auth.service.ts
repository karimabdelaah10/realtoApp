import { Injectable } from '@nestjs/common';
import { AuthRegisterDto } from './dtos/auth.register.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs'; // Ensure bcrypt is installed for password hashing
import * as jwt from 'jsonwebtoken';
import { AuthLoginDto } from './dtos/auth.login.dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async registerNewUser(registerNewUserBody: AuthRegisterDto) {
    const isExistingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            email: registerNewUserBody.email,
          },
          {
            mobile: registerNewUserBody.mobile,
          },
        ],
      },
    });
    if (isExistingUser) {
      return {
        code: 422,
        message: 'User already exists with this email or mobile number',
        token: null,
        user: isExistingUser,
      };
    }
    const createsUser = await this.prismaService.user.create({
      data: {
        email: registerNewUserBody.email,
        password: await bcrypt.hash(registerNewUserBody.password, 6), // In a real application, ensure to hash the password
        name: registerNewUserBody.name,
        mobile: registerNewUserBody.mobile,
      },
    });
    return {
      code: 200,
      message: 'User registered successfully',
      token: this.generateToken(createsUser),
    };
  }

  async loginUser(loginData: AuthLoginDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        mobile: loginData.mobile,
      },
    });
    if (!existingUser) {
      return {
        code: 404,
        message: 'User not found',
        token: null,
      };
    }
    const validPassword = await bcrypt.compare(
      loginData.password,
      existingUser.password,
    );
    if (!validPassword) {
      return {
        code: 401,
        message: 'Invalid password',
        token: null,
      };
    }
    return {
      code: 200,
      message: 'User logged in successfully',
      token: this.generateToken(existingUser),
    };
  }

  generateToken(user): string {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        type: user.type,
      },
      process.env.JWT_TOKEN_KEY as string,
    );
  }
}
