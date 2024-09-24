import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { env } from 'node:process';
import { CreateAuthorDto } from '../src/authors/dtos/create-author.dto';
import { DataSource, EntityManager } from 'typeorm';
import { AuthorEntity } from '../src/authors/entities/author.entity';

env.NODE_ENV = 'test';
env.DB_NAME = 'api_dev';
env.DB_USER = 'api_dev';
env.DB_PASS = 'api_dev';

describe('AppController (e2e)', () => {
  let dbContainer: StartedMySqlContainer;
  let app: INestApplication;
  let datasource: DataSource;
  let em: EntityManager;

  beforeAll(async () => {
    dbContainer = await new MySqlContainer('mysql:8')
      .withName('nestjs-sytac-devjam-sept-2024-mysql-test')
      .withDatabase(env.DB_NAME)
      .withUsername(env.DB_USER)
      .withUserPassword(env.DB_PASS)
      .withResourcesQuota({
        cpu: 2,
        memory: 1024,
      })
      .start();
    env.DB_HOST = dbContainer.getHost();
    env.DB_PORT = dbContainer.getPort().toString();
  }, 20000);

  afterAll(async () => {
    await dbContainer.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    datasource = app.get(DataSource);
    em = datasource.createEntityManager();
    await app.init();
  });

  it('Should be Health(y)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  describe('Author API', () => {
    it('Should get authors', async () => {
      const author = new AuthorEntity(1);
      author.name = 'Test Author';
      await em.save(AuthorEntity, author);
      return request(app.getHttpServer())
        .get('/authors')
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toEqual(1);
          expect(body[0].name).toEqual(author.name);
        });
    });

    it('Should add an author', async () => {
      const newAuthor = new CreateAuthorDto();
      newAuthor.name = 'Tester Man';
      return request(app.getHttpServer())
        .post('/authors')
        .send(newAuthor)
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).not.toBeNull();
          expect(body.created).not.toBeNull();
          expect(body.updated).not.toBeNull();
          expect(body.name).toBe(newAuthor.name);
        });
    });
  });
});
