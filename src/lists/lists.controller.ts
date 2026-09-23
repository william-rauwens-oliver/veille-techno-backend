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
import { ListsService } from './lists.service.js';
import { CreateListDto } from './dto/create-list.dto.js';
import { UpdateListDto } from './dto/update-list.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('lists')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle liste' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateListDto) {
    return this.listsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister ses listes (avec leurs cartes)' })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.listsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une liste et ses cartes' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.listsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une liste' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateListDto,
  ) {
    return this.listsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une liste (et ses cartes)' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.listsService.remove(user.id, id);
  }
}
