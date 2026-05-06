import { CatColor } from '../../domain/cats.color.enum';

export type CreateCatInput = {
  name: string;
  age: number;
  color: CatColor;
};