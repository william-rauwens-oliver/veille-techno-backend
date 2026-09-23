import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ example: 'Rédiger le README' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 'Expliquer comment lancer le projet' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'b3f1c2d4-5678-90ab-cdef-1234567890ab',
    description: 'Id de la liste à laquelle rattacher la carte',
  })
  @IsUUID()
  listId: string;

  @ApiPropertyOptional({ example: 0, description: "Position d'affichage" })
  @IsOptional()
  @IsInt()
  position?: number;
}
