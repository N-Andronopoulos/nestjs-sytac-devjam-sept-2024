import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { AuthorsModule } from '../authors/authors.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity]), AuthorsModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, TypeOrmModule],
})
export class BooksModule {}
