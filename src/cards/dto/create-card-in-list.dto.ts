import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCardInListDto {
  @ApiProperty({ example: 'Rédiger le README' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 'Expliquer comment lancer le projet' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 0, description: "Position d'affichage" })
  @IsOptional()
  @IsInt()
  position?: number;
}
