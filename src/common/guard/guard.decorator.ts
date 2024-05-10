import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import { EGuardDecoratorKey } from '../constant/constant';

export const PublicApi = () => SetMetadata(EGuardDecoratorKey.IS_PUBLIC_KEY, true);

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
