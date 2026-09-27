import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateCardInput {
  @Field()
  @IsString()
  @MinLength(1)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsUUID()
  listId: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  position?: number;
}
