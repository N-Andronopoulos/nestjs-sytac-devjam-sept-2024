import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBookDto } from './dtos/update-book.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly bookService: BooksService) {}

  @Get()
  public get() {
    return this.bookService.getAll();
  }

  @Get('/:id')
  public getById(@Param('id') id: number) {
    return this.bookService.getById(id);
  }

  @Post()
  public create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @Patch()
  public update(@Body() dto: UpdateBookDto) {
    this.logger.log(`Updating book ${dto.id}`);
    return this.bookService.update(dto);
  }

  @Delete('/:id')
  public delete(@Param('id') id: number) {
    this.logger.log(`Deleting book ${id}`);
    return this.bookService.delete(id);
  }
}
