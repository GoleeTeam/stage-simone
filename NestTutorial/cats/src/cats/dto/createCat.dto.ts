import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CatColor } from '../domain/cats.color.enum';

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  age!: number;

  @IsEnum(CatColor)
  @IsNotEmpty()
  color!: CatColor;
}
