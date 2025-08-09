import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

interface JWTPayload {
  id: number;
  name: string;
  email: string;
  mobile: string;
  type: string;
  iat: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];
    if (!token) {
      return false; // No token provided
    }
    try {
      const user = jwt.verify(
        token,
        process.env.JWT_TOKEN_KEY as string,
      ) as JWTPayload;
      if (!user) {
        return false; // Invalid token
      }
      if (!roles.includes(user.type)) {
        return false; // User does not have the required role
      }
    } catch (error) {
      console.log('Error verifying token:', error);
      return false; // Token decoding failed
    }

    return true;
  }
}
