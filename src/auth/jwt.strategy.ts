/**
 * JWT Strategy for Authentication
 * This strategy extracts the JWT token from the request and validates it.
 * It uses the Passport library to handle JWT authentication.
 * The validate method checks the payload and returns user information from the database.
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
    // Query the database to get the actual user
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    // Return user info that will be attached to request.user
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
