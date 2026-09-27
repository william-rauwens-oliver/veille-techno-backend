import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ListsModule } from './lists/lists.module.js';
import { CardsModule } from './cards/cards.module.js';
import { GraphqlApiModule } from './graphql/graphql-api.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      context: ({ req }: { req: unknown }) => ({ req }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListsModule,
    CardsModule,
    GraphqlApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
