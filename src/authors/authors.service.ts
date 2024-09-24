import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';

@Injectable()
export class AuthorsService {
  private readonly logger = new Logger(AuthorsService.name);

  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepo: Repository<AuthorEntity>,
  ) {}

  public getAll() {
    return this.authorRepo.find({ relations: { books: true } });
  }

  public getById(id: number) {
    return this.authorRepo.findOne({
      where: { id },
      relations: { books: true },
    });
  }

  public create(dto: CreateAuthorDto) {
    return this.authorRepo.save(dto);
  }

  public update(dto: UpdateAuthorDto) {
    return this.authorRepo.save(dto);
  }

  public delete(id: number) {
    return this.authorRepo.delete(id);
  }
}
