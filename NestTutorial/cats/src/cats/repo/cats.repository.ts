import { Cat } from '../domain/cat.class';
import { CatColor } from '../domain/cats.color.enum';

export interface CatsRepository {
  save(cat: Cat): Promise<void>;

  update(id: string, cat: Cat): Promise<void>;

  remove(id: string): Promise<void>;

  findAll(): Promise<Cat[]>;

  findOne(id: string): Promise<Cat | undefined>;

  filterByColor(color: CatColor): Promise<Cat[]>;
}