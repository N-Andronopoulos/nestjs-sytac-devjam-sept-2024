import { IsISBN, IsNotEmpty, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  public name: string;
  @IsISBN()
  public isbn: string;
  @IsNotEmpty()
  @MinLength(5)
  public description: string;
  @IsNotEmpty()
  public authorId: number;
}
