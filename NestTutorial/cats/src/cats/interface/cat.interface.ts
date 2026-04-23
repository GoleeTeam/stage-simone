import { CatColor } from "../enum/cats.color.enum";

export interface Cat {
  id: string;
  name: string;
  age: number;
  color: CatColor;
}