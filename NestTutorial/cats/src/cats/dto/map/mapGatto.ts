import { CreateGattoDto } from '../createGatto.dto';
import { CreateCatInput } from '../input/createCatInput.dto';
import { mapCatColori } from './mapCatColori';

export function mapGatto(dto: CreateGattoDto): CreateCatInput {
  return {
    name: dto.nome,
    age: dto.eta,
    color: mapCatColori(dto.colore),
  };
}