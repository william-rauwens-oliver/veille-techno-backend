import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Kanban API (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const email = `it-${Date.now()}@example.com`;
  let token: string;
  let userId: string;
  let listId: string;
  let cardId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
    }
    await app.close();
  });

  it('refuse une inscription avec un email invalide (400)', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'pas-un-email', name: 'Jo', password: 'secret123' })
      .expect(400);
  });

  it('inscrit un utilisateur et renvoie un token (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, name: 'Test', password: 'secret123' })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
    token = res.body.accessToken;
    userId = res.body.user.id;
  });

  it('refuse la connexion avec un mauvais mot de passe (401)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'mauvais' })
      .expect(401);
  });

  it('refuse l accès aux listes sans token (401)', async () => {
    await request(app.getHttpServer()).get('/lists').expect(401);
  });

  it('crée une liste (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Do' })
      .expect(201);

    expect(res.body.title).toBe('To Do');
    listId = res.body.id;
  });

  it('crée une carte dans la liste (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ma tâche', listId })
      .expect(201);

    expect(res.body.title).toBe('Ma tâche');
    cardId = res.body.id;
  });

  it('modifie la carte (200)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'description mise à jour' })
      .expect(200);

    expect(res.body.description).toBe('description mise à jour');
  });

  it('liste ses listes avec les cartes (200)', async () => {
    const res = await request(app.getHttpServer())
      .get('/lists')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].cards).toHaveLength(1);
  });

  it('empêche un utilisateur de changer son propre rôle (403)', async () => {
    await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' })
      .expect(403);
  });

  it('supprime la carte puis la liste (200)', async () => {
    await request(app.getHttpServer())
      .delete(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/lists/${listId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
