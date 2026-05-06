import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CatColori } from '../../domain/cats.colori.enum';

export class FilterCatColoriDto {
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsEnum(CatColori)
  @IsNotEmpty()
  color!: CatColori;
}
