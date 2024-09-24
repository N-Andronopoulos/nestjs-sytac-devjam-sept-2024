import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { AuthorsService } from '../authors/authors.service';
import { AuthorEntity } from '../authors/entities/author.entity';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepo: Repository<BookEntity>,
    private readonly authorsService: AuthorsService,
  ) {}

  public getById(id: number) {
    return this.bookRepo.findOne({
      where: { id },
      relations: { author: true },
    });
  }

  public getAll() {
    this.logger.log(`Getting all books.`);
    return this.bookRepo.find({ relations: { author: true } });
  }

  public async create(dto: CreateBookDto): Promise<BookEntity> {
    const author = await this.authorsService.getById(dto.authorId);
    if (!author)
      throw new NotFoundException(`No author with id: ${dto.authorId}`);
    delete dto.authorId;
    this.logger.log(`Saving book ${dto.name}`);
    return await this.bookRepo.save({
      ...dto,
      author: new AuthorEntity(author.id),
    });
  }

  public update(dto: UpdateBookDto) {
    return this.bookRepo.save(dto);
  }

  public delete(id: number) {
    return this.bookRepo.delete(id);
  }
}
