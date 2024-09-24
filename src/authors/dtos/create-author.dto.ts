import { IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  public name: string;
}
