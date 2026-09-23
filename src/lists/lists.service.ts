import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateListDto } from './dto/create-list.dto.js';
import { UpdateListDto } from './dto/update-list.dto.js';

@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService) {}

  create(ownerId: string, dto: CreateListDto) {
    return this.prisma.list.create({
      data: { title: dto.title, position: dto.position ?? 0, ownerId },
    });
  }

  findAll(ownerId: string) {
    return this.prisma.list.findMany({
      where: { ownerId },
      orderBy: { position: 'asc' },
      include: { cards: { orderBy: { position: 'asc' } } },
    });
  }

  async findOne(ownerId: string, id: string) {
    const list = await this.prisma.list.findFirst({
      where: { id, ownerId },
      include: { cards: { orderBy: { position: 'asc' } } },
    });

    if (!list) {
      throw new NotFoundException('Liste introuvable');
    }

    return list;
  }

  async update(ownerId: string, id: string, dto: UpdateListDto) {
    await this.findOne(ownerId, id);
    return this.prisma.list.update({ where: { id }, data: dto });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.list.delete({ where: { id } });
    return { deleted: true };
  }
}
