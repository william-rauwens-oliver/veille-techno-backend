import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Card')
export class CardModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Int)
  position: number;

  @Field()
  listId: string;
}
