import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateCardDto) {
    await this.assertListOwnership(ownerId, dto.listId);

    return this.prisma.card.create({
      data: {
        title: dto.title,
        description: dto.description,
        position: dto.position ?? 0,
        listId: dto.listId,
      },
    });
  }

  async findOne(ownerId: string, id: string) {
    const card = await this.prisma.card.findFirst({
      where: { id, list: { ownerId } },
    });

    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    return card;
  }

  async update(ownerId: string, id: string, dto: UpdateCardDto) {
    await this.findOne(ownerId, id);

    if (dto.listId !== undefined) {
      await this.assertListOwnership(ownerId, dto.listId);
    }

    return this.prisma.card.update({ where: { id }, data: dto });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.card.delete({ where: { id } });
    return { deleted: true };
  }

  private async assertListOwnership(ownerId: string, listId: string) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });

    if (!list) {
      throw new NotFoundException('Liste introuvable');
    }

    if (list.ownerId !== ownerId) {
      throw new ForbiddenException("Cette liste ne vous appartient pas");
    }
  }
}
