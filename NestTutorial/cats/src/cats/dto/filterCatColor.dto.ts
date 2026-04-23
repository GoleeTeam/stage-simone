import { IsEnum, IsNotEmpty } from 'class-validator';
import { CatColor } from '../enum/cats.color.enum';
import { Transform } from 'class-transformer';

export class FilterCatDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(CatColor)
  @IsNotEmpty()
  color: CatColor;
}