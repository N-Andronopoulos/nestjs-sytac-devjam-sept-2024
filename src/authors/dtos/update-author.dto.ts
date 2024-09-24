import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAuthorDto {
  @IsNumber()
  public id: number;
  @IsNotEmpty()
  public name: string;
}
