import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CatColor } from '../domain/cats.color.enum';

export class FilterCatDto {
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsEnum(CatColor)
  @IsNotEmpty()
  color!: CatColor;
}
