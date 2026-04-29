import { Cat } from '../domain/cat.interface';
import { CatColor } from '../domain/cats.color.enum';

export interface CatsRepository {
  save(cat: Cat): void;

  update(id: string, cat: Cat): void;

  remove(id: string, color: CatColor): void;

  findAll(): Cat[];

  findOne(id: string): Cat | undefined;

  filterByColor(color: CatColor): Cat[];
}
