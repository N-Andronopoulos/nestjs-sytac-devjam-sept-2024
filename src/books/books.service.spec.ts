import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { DeleteResult, Repository } from 'typeorm';
import { BookEntity } from './entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { AuthorsService } from '../authors/authors.service';
import { AuthorEntity } from '../authors/entities/author.entity';

describe('BooksService', () => {
  let booksService: BooksService;
  let bookRepo: Repository<BookEntity>;
  let authorService: AuthorsService;

  const bookRepoToken = getRepositoryToken(BookEntity);
  const authorRepoToken = getRepositoryToken(AuthorEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        AuthorsService,
        {
          provide: bookRepoToken,
          useClass: Repository,
        },
        {
          provide: authorRepoToken,
          useClass: Repository,
        },
      ],
    }).compile();

    bookRepo = module.get<Repository<BookEntity>>(bookRepoToken);
    booksService = module.get<BooksService>(BooksService);
    authorService = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(booksService).toBeDefined();
    expect(bookRepo).toBeDefined();
  });

  it('should be able to add book', async () => {
    const dto = new CreateBookDto();
    dto.name = 'Tester Man';
    dto.isbn = '978-3-16-148410-0';
    dto.description = 'A description';
    dto.authorId = 1;

    const authorEntity = new AuthorEntity(1);
    authorEntity.name = dto.name;
    authorEntity.created = new Date();
    authorEntity.updated = new Date();

    const bookEntity = new BookEntity(1);
    bookEntity.name = dto.name;
    bookEntity.isbn = '978-3-16-148410-0';
    bookEntity.description = 'A description';
    bookEntity.created = new Date();
    bookEntity.updated = new Date();
    bookEntity.author = authorEntity;

    jest.spyOn(authorService, 'getById').mockResolvedValueOnce(authorEntity);
    jest.spyOn(bookRepo, 'save').mockResolvedValueOnce(bookEntity);

    const res = await booksService.create(dto);

    expect(res).toEqual(bookEntity);
    expect(bookRepo.save).toHaveBeenCalledWith({
      ...dto,
      author: new AuthorEntity(1),
    });
    expect(authorService.getById).toHaveBeenCalledWith(1);
  });

  it('should be able to get all books', async () => {
    const book1 = new BookEntity(1);
    book1.name = 'Tester Man 1';
    const book2 = new BookEntity(2);
    book2.name = 'Tester Man 2';
    const books = [book1, book2];

    jest.spyOn(bookRepo, 'find').mockResolvedValueOnce(books);

    const res = await booksService.getAll();

    expect(res).toEqual(books);
    expect(bookRepo.find).toHaveBeenCalledWith({
      relations: { author: true },
    });
  });

  it('should be able to get specific book', async () => {
    const book1 = new BookEntity(1);
    book1.name = 'Tester Man 1';

    jest.spyOn(bookRepo, 'findOne').mockResolvedValueOnce(book1);

    const res = await booksService.getById(1);

    expect(res).toEqual(book1);
    expect(bookRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { author: true },
    });
  });

  it('should be able to update book', async () => {
    const dto = new UpdateBookDto();
    dto.id = 1;
    dto.name = 'Tester Man 1.1';
    const book = new BookEntity(1);
    book.name = 'Tester Man 1.1';

    jest.spyOn(bookRepo, 'save').mockResolvedValueOnce(book);

    const res = await booksService.update(dto);

    expect(res).toEqual(book);
    expect(bookRepo.save).toHaveBeenCalledWith(dto);
  });

  it('should be able to delete book', async () => {
    const dto = new UpdateBookDto();
    dto.id = 1;
    dto.name = 'Tester Man 1.1';
    const book = new BookEntity(1);
    book.name = 'Tester Man 1.1';

    jest.spyOn(bookRepo, 'delete').mockResolvedValueOnce({
      affected: 1,
    } as DeleteResult);

    const res = await booksService.delete(1);

    expect(res.affected).toEqual(1);
    expect(bookRepo.delete).toHaveBeenCalledWith(1);
  });
});
