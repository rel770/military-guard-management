/**
 * JWT Strategy for Authentication
 * This strategy extracts the JWT token from the request and validates it.
 * It uses the Passport library to handle JWT authentication.
 * The validate method checks the payload and returns user information.
 * If the token is invalid or expired, it throws an UnauthorizedException.
 * 
 * This strategy is used in conjunction with the `JwtAuthGuard` to protect routes.
 * 
 * @see {@link https://docs.nestjs.com/security/authentication}
 * @see {@link https://docs.nestjs.com/guards}
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'the-secret-secret-key',
    });
  }

  async validate(payload: any) {
    // In stage 2, we'll use mock data validation
    // Later in stage 3, this will query the database
    const user = {
      userId: payload.sub,  // sub means subject. standard field in JWT (RFC 7519)
      email: payload.email,
      role: payload.role,
    };

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
