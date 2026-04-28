import { Injectable } from '@nestjs/common';
import { Cat } from '../domain/cat.interface';
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

  save(cat: Cat): void {
    this.catsById.set(cat.id, cat);
    this.addCatsByColor(cat);
  }

  update(id: string, cat: Cat): void {
    const oldCat = this.catsById.get(id);

    if (oldCat) {
      this.catsByColor.get(oldCat.color)?.delete(id);
    }

    this.save(cat);
  }

  remove(id: string, color: CatColor): void {
    this.catsById.delete(id);
    this.catsByColor.get(color)?.delete(id);
  }

  findAll(): Cat[] {
    return Array.from(this.catsById.values());
  }

  findOne(id: string): Cat | undefined {
    const cat = this.catsById.get(id);
    return cat;
  }

  filterByColor(color: CatColor): Cat[] {
    const ids = this.catsByColor.get(color);
    if (!ids) return [];
    return Array.from(ids)
      .map((id) => this.catsById.get(id))
      .filter((cat): cat is Cat => cat !== undefined);
  }
}
