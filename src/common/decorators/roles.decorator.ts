/**
 * Decorator to define roles for route handlers.
 * This decorator uses metadata to specify which roles are allowed to access the route.
 */

import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles'; // Key for metadata storage

// Decorator function to set roles metadata
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
