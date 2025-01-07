import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException("AUTHORIZATION_FAILED");
    }
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (roles) {
      const hasAccess = roles.some(role => user?.role.includes(role));
      if (!hasAccess) {
        throw new UnauthorizedException('The user does not have valid roles.');
      }
    }
    return user;
  }
}
