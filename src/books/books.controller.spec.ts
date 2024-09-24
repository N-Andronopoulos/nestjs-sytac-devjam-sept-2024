import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { AuthorsService } from '../authors/authors.service';
import { AuthorEntity } from '../authors/entities/author.entity';

describe('BooksController', () => {
  let controller: BooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        AuthorsService,
        {
          provide: getRepositoryToken(BookEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AuthorEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
