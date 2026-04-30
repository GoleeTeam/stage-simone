import { Injectable } from '@nestjs/common';
import { Cat } from '../domain/cat.class';
import { CatColor } from '../domain/cats.color.enum';
import { CatsRepository } from './cats.repository';

@Injectable()
export class CatsInMemoryRepository implements CatsRepository {
  private catsById = new Map<string, Cat>();
  private catsByColor = new Map<CatColor, Set<string>>();

  private addCatsByColor(cat: Cat): void {
    if (!this.catsByColor.has(cat.color)) {
      this.catsByColor.set(cat.color, new Set());
    }
    this.catsByColor.get(cat.color)!.add(cat.id);
  }

  async save(cat: Cat): Promise<void> {
    this.catsById.set(cat.id, cat);
    this.addCatsByColor(cat);
  }

  async update(id: string, cat: Cat): Promise<void> {
    const oldCat = this.catsById.get(id);

    if (oldCat) {
      this.catsByColor.get(oldCat.color)?.delete(id);
    }

    this.save(cat);
  }

  async remove(id: string): Promise<void> {
    const cat = this.catsById.get(id);

    if (!cat) return;

    this.catsById.delete(id);
    this.catsByColor.get(cat.color)?.delete(id);
  }

  async findAll(): Promise<Cat[]> {
    return Array.from(this.catsById.values());
  }

  async findOne(id: string): Promise<Cat | undefined> {
    return this.catsById.get(id);
  }

  async filterByColor(color: CatColor): Promise<Cat[]> {
    const ids = this.catsByColor.get(color);
    if (!ids) return [];

    return Array.from(ids)
      .map((id) => this.catsById.get(id))
      .filter((cat): cat is Cat => cat !== undefined);
  }
}