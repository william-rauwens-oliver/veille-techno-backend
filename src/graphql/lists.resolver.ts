import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ListModel } from './models/list.model.js';
import { CreateListInput } from './dto/create-list.input.js';
import { ListsService } from '../lists/lists.service.js';
import { GqlAuthGuard } from './gql-auth.guard.js';
import { GqlUser } from './gql-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Resolver(() => ListModel)
@UseGuards(GqlAuthGuard)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Query(() => [ListModel])
  lists(@GqlUser() user: AuthenticatedUser) {
    return this.listsService.findAll(user.id);
  }

  @Mutation(() => ListModel)
  createList(
    @GqlUser() user: AuthenticatedUser,
    @Args('input') input: CreateListInput,
  ) {
    return this.listsService.create(user.id, input);
  }

  @Mutation(() => Boolean)
  async deleteList(
    @GqlUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.listsService.remove(user.id, id);
    return true;
  }
}
