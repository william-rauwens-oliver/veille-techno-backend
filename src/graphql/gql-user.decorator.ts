import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

export const GqlUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    return GqlExecutionContext.create(context).getContext().req.user;
  },
);
