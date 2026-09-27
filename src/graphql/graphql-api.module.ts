import { Module } from '@nestjs/common';
import { ListsModule } from '../lists/lists.module.js';
import { CardsModule } from '../cards/cards.module.js';
import { ListsResolver } from './lists.resolver.js';
import { CardsResolver } from './cards.resolver.js';
import { GqlAuthGuard } from './gql-auth.guard.js';

@Module({
  imports: [ListsModule, CardsModule],
  providers: [ListsResolver, CardsResolver, GqlAuthGuard],
})
export class GraphqlApiModule {}
