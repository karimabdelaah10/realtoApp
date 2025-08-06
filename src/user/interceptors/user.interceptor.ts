import { NestInterceptor, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next) {
    const request = context.switchToHttp().getRequest();
    const headerToken = request?.headers?.authorization?.split('Bearer ')[1];
    request.user = await jwt.decode(headerToken);
    return next.handle();
  }
}
