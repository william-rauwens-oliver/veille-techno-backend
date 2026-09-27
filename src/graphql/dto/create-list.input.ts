import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateListInput {
  @Field()
  @IsString()
  @MinLength(1)
  title: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  position?: number;
}
