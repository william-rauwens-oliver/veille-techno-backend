import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateListDto {
  @ApiProperty({ example: 'To Do' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 0, description: "Position d'affichage" })
  @IsOptional()
  @IsInt()
  position?: number;
}
