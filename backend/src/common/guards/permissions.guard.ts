import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true; // No specific permissions required
    }

    const { user } = context.switchToHttp().getRequest();
    
    // User must be authenticated to have permissions
    if (!user) {
      return false;
    }

    // Tenant Owners or Super Admins have a '*' permission embedded, or are explicitly checked
    if (user.isMasterAdmin || user.permissions?.includes('*')) {
      return true;
    }

    // Check if the user has all the required permissions
    const userPermissions = user.permissions || [];
    
    // Using `.every` so that if multiple are specified, the user must have all of them.
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}
