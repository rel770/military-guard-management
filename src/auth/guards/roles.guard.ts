import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';

@Injectable()
/**
 * Roles Guard
 * This guard checks if the user has the required roles to access a route.
 * It uses metadata set by the Roles decorator to determine access.
 * If the user does not have the required role, it denies access.
 * 
 * @see {@link https://docs.nestjs.com/guards}
 */
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Get metadata from the handler (method)
      context.getClass(),   // Get metadata from the class (controller)
    ]);

    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request
    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user.role === role);
  }
}
