/**
 * JWT Authentication Guard
 * This guard uses the JWT strategy to protect routes.
 * It checks for a valid JWT token in the request and extracts user information.
 * It throws an UnauthorizedException if the token is invalid or missing.
 * It is used to secure endpoints that require authentication.

 * @see {@link https://docs.nestjs.com/guards}
 * @see {@link https://docs.nestjs.com/security/authentication}
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
