import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CatColori } from '../../domain/cats.colori.enum';

export class CreateGattoDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  @IsNotEmpty()
  eta!: number;

  @IsEnum(CatColori)
  @IsNotEmpty()
  colore!: CatColori;
}
