import { CreateCatDto } from '../dto/createCat.dto';
import { CreateCatInput } from '../../application/input/createCatInput';

export function mapCat(dto: CreateCatDto): CreateCatInput {
  return {
    name: dto.name,
    age: dto.age,
    color: dto.color,
  };
}
