import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { CardModel } from './card.model.js';

@ObjectType('List')
export class ListModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  position: number;

  @Field(() => [CardModel], { nullable: true })
  cards?: CardModel[];
}
