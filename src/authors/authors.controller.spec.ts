import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { AuthorsService } from './authors.service';

describe('AuthorsController', () => {
  let controller: AuthorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(AuthorEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
