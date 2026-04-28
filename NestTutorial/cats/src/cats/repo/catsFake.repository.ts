import { Injectable } from '@nestjs/common';
import { Cat } from '../domain/cat.interface';
import { CatColor } from '../domain/cats.color.enum';
import { CatsRepository } from './cats.repository';

@Injectable()
export class CatsFakeRepository implements CatsRepository {
  private addCatsByColor(cat: Cat): void {}

  save(cat: Cat): void {}

  update(id: string, cat: Cat): void {}

  remove(id: string, color: CatColor): void {}

  findAll(): Cat[] {
    return [];
  }

  findOne(id: string): Cat | undefined {
    return undefined;
  }

  filterByColor(color: CatColor): Cat[] {
    return [];
  }
}
