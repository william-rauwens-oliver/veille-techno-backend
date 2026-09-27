import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { CardModel } from './models/card.model.js';
import { CreateCardInput } from './dto/create-card.input.js';
import { CardsService } from '../cards/cards.service.js';
import { GqlAuthGuard } from './gql-auth.guard.js';
import { GqlUser } from './gql-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Resolver(() => CardModel)
@UseGuards(GqlAuthGuard)
export class CardsResolver {
  constructor(private readonly cardsService: CardsService) {}

  @Mutation(() => CardModel)
  createCard(
    @GqlUser() user: AuthenticatedUser,
    @Args('input') input: CreateCardInput,
  ) {
    return this.cardsService.create(user.id, input);
  }

  @Mutation(() => Boolean)
  async deleteCard(
    @GqlUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.cardsService.remove(user.id, id);
    return true;
  }
}
