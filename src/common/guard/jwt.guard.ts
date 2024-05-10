import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { EGuardDecoratorKey } from '../constant/constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(EGuardDecoratorKey.IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const { headers } = context.switchToHttp().getRequest();
    const bearToken = (headers?.authorization || '').split(' ')[1] || '';
    if (bearToken) {
      return super.canActivate(context);
    }
    return false;
  }
}
