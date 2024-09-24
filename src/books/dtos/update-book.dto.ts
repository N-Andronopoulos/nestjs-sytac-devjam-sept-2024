import { IsISBN, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class UpdateBookDto {
  @IsNumber()
  public id: number;
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
