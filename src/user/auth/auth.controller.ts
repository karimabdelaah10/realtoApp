import { Body, Controller, Post } from '@nestjs/common';
import { AuthRegisterDto } from './dtos/auth.register.dto';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth.login.dto';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('/register')
  registerNewUser(@Body() requestBody: AuthRegisterDto) {
    return this.authService.registerNewUser(requestBody);
  }

  @Post('/login')
  loginUser(@Body() requestBody: AuthLoginDto) {
    return this.authService.loginUser(requestBody);
  }
}
