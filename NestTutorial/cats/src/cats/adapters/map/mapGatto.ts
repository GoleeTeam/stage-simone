import { CreateGattoDto } from '../dto/createGatto.dto';
import { CreateCatInput } from '../../application/input/createCatInput';
import { mapCatColori } from './mapCatColori';

export function mapGatto(dto: CreateGattoDto): CreateCatInput {
  return {
    name: dto.nome,
    age: dto.eta,
    color: mapCatColori(dto.colore),
  };
}
