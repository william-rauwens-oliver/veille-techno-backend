import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardsService } from './cards.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une carte dans une liste' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCardDto) {
    return this.cardsService.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une carte' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.cardsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une carte (titre, description, position…)' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une carte' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.cardsService.remove(user.id, id);
  }
}
