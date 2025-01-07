import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';
import { JwtPayload } from 'src/types/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user) {
      throw new NotFoundException('No user found');
    }
    return user._id;
  },
);
