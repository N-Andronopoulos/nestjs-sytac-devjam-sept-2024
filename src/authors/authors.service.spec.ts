import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { DeleteResult, Repository } from 'typeorm';
import { AuthorEntity } from './entities/author.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorRepo: Repository<AuthorEntity>;

  const repositoryToken = getRepositoryToken(AuthorEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: repositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    authorRepo = module.get<Repository<AuthorEntity>>(repositoryToken);
    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(authorRepo).toBeDefined();
  });

  it('should be able to add author', async () => {
    const dto = new CreateAuthorDto();
    dto.name = 'Tester Man';
    const createdAuthor = new AuthorEntity(1);
    createdAuthor.name = dto.name;
    createdAuthor.created = new Date();
    createdAuthor.updated = new Date();

    jest.spyOn(authorRepo, 'save').mockResolvedValueOnce(createdAuthor);

    const res = await service.create(dto);

    expect(res).toEqual(createdAuthor);
    expect(authorRepo.save).toHaveBeenCalledWith(dto);
  });

  it('should be able to get all authors', async () => {
    const author1 = new AuthorEntity(1);
    author1.name = 'Tester Man 1';
    const author2 = new AuthorEntity(2);
    author2.name = 'Tester Man 2';
    const authors = [author1, author2];

    jest.spyOn(authorRepo, 'find').mockResolvedValueOnce(authors);

    const res = await service.getAll();

    expect(res).toEqual(authors);
    expect(authorRepo.find).toHaveBeenCalledWith({
      relations: { books: true },
    });
  });

  it('should be able to get specific author', async () => {
    const author1 = new AuthorEntity(1);
    author1.name = 'Tester Man 1';

    jest.spyOn(authorRepo, 'findOne').mockResolvedValueOnce(author1);

    const res = await service.getById(1);

    expect(res).toEqual(author1);
    expect(authorRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { books: true },
    });
  });

  it('should be able to update author', async () => {
    const dto = new UpdateAuthorDto();
    dto.id = 1;
    dto.name = 'Tester Man 1.1';
    const author = new AuthorEntity(1);
    author.name = 'Tester Man 1.1';

    jest.spyOn(authorRepo, 'save').mockResolvedValueOnce(author);

    const res = await service.update(dto);

    expect(res).toEqual(author);
    expect(authorRepo.save).toHaveBeenCalledWith(dto);
  });

  it('should be able to delete author', async () => {
    const dto = new UpdateAuthorDto();
    dto.id = 1;
    dto.name = 'Tester Man 1.1';
    const author = new AuthorEntity(1);
    author.name = 'Tester Man 1.1';

    jest.spyOn(authorRepo, 'delete').mockResolvedValueOnce({
      affected: 1,
    } as DeleteResult);

    const res = await service.delete(1);

    expect(res.affected).toEqual(1);
    expect(authorRepo.delete).toHaveBeenCalledWith(1);
  });
});
