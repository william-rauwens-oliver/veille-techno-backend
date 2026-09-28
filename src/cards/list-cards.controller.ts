import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardsService } from './cards.service.js';
import { CreateCardInListDto } from './dto/create-card-in-list.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('lists/:listId/cards')
export class ListCardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: "Lister les cartes d'une liste" })
  findByList(
    @CurrentUser() user: AuthenticatedUser,
    @Param('listId') listId: string,
  ) {
    return this.cardsService.findByList(user.id, listId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une carte dans une liste' })
  createInList(
    @CurrentUser() user: AuthenticatedUser,
    @Param('listId') listId: string,
    @Body() dto: CreateCardInListDto,
  ) {
    return this.cardsService.createInList(user.id, listId, dto);
  }
}
