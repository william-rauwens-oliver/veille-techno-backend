import { Module } from '@nestjs/common';
import { CardsService } from './cards.service.js';
import { CardsController } from './cards.controller.js';
import { ListCardsController } from './list-cards.controller.js';

@Module({
  controllers: [CardsController, ListCardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
