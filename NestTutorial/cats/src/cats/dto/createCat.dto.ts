import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { CatColor } from '../enum/cats.color.enum';

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsEnum(CatColor)
  @IsNotEmpty()
  color: CatColor;
}
