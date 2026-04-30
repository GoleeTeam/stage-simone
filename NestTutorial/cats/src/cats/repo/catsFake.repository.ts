import { Injectable } from '@nestjs/common';
import { Cat } from '../domain/cat.class';
import { CatColor } from '../domain/cats.color.enum';
import { CatsRepository } from './cats.repository';

@Injectable()
export class CatsFakeRepository implements CatsRepository {
  private cats: Cat[] = [];

  save(cat: Cat): void {
    this.cats.push(cat);
  }

  update(id: string, cat: Cat): void {
    const index = this.cats.findIndex((c) => c.id === id);
    if (index === -1) return;
    this.cats[index] = cat;
  }

  remove(id: string): void {
    this.cats = this.cats.filter((c) => c.id !== id);
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(id: string): Cat | undefined {
    return this.cats.find((c) => c.id === id);
  }

  filterByColor(color: CatColor): Cat[] {
    return this.cats.filter((c) => c.color === color);
  }
}
