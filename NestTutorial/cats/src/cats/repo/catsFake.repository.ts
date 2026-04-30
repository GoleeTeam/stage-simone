import { Injectable } from '@nestjs/common';
import { Cat } from '../domain/cat.class';
import { CatColor } from '../domain/cats.color.enum';
import { CatsRepository } from './cats.repository';

@Injectable()
export class CatsFakeRepository implements CatsRepository {
  private cats: Cat[] = [];

  async save(cat: Cat): Promise<void> {
    this.cats.push(cat);
  }

  async update(id: string, cat: Cat): Promise<void> {
    const index = this.cats.findIndex((c) => c.id === id);
    if (index === -1) return;

    this.cats[index] = cat;
  }

  async remove(id: string): Promise<void> {
    this.cats = this.cats.filter((c) => c.id !== id);
  }

  async findAll(): Promise<Cat[]> {
    return this.cats;
  }

  async findOne(id: string): Promise<Cat | undefined> {
    return this.cats.find((c) => c.id === id);
  }

  async filterByColor(color: CatColor): Promise<Cat[]> {
    return this.cats.filter((c) => c.color === color);
  }
}
