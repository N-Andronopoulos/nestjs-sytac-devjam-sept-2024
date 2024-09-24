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
import { AuthorsService } from './authors.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  private readonly logger = new Logger(AuthorsController.name);

  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  public get() {
    return this.authorsService.getAll();
  }

  @Get('/:id')
  public getById(@Param('id') id: number) {
    return this.authorsService.getById(id);
  }

  @Post()
  public create(@Body() dto: CreateAuthorDto) {
    this.logger.log(`Creating new author: ${dto.name}`);
    return this.authorsService.create(dto);
  }

  @Patch()
  public update(@Body() dto: UpdateAuthorDto) {
    this.logger.log(`Updating author ${dto.id}`);
    return this.authorsService.update(dto);
  }

  @Delete('/:id')
  public delete(@Param('id') id: number) {
    this.logger.log(`Deleting author ${id}`);
    return this.authorsService.delete(id);
  }
}
