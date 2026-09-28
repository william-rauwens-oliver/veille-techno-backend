import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('GraphQL API (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const email = `gql-${Date.now()}@example.com`;
  let token: string;
  let userId: string;
  let listId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api', { exclude: ['/'] });
    await app.init();
    prisma = app.get(PrismaService);

    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, name: 'GraphQL Tester', password: 'secret123' });
    token = res.body.accessToken;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
    }
    await app.close();
  });

  it('refuse une requête GraphQL sans token', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ lists { id } }' })
      .expect(200);

    expect(res.body.errors).toBeDefined();
  });

  it('crée une liste via une mutation GraphQL', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query:
          'mutation { createList(input: { title: "GraphQL" }) { id title } }',
      })
      .expect(200);

    expect(res.body.data.createList.title).toBe('GraphQL');
    listId = res.body.data.createList.id;
  });

  it('retourne ses listes via une query GraphQL', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: '{ lists { id title cards { id } } }' })
      .expect(200);

    expect(res.body.data.lists).toHaveLength(1);
    expect(res.body.data.lists[0].id).toBe(listId);
  });
});
