import { CreateCatDto } from '../createCat.dto';
import { CreateCatInput } from '../input/createCatInput';

export function mapCat(dto: CreateCatDto): CreateCatInput {
  return {
    name: dto.name,
    age: dto.age,
    color: dto.color,
  };
}