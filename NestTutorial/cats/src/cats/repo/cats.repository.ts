import { Injectable } from '@nestjs/common';
import { Cat } from '../interface/cat.interface';
import { CatColor } from '../enum/cats.color.enum';

@Injectable()
export class CatsRepository {
  private catsById = new Map<string, Cat>();
  private catsByColor = new Map<CatColor, Set<string>>();

  AddcatsByColor(cat:Cat)
  {
    if (!this.catsByColor.has(cat.color)) {
      this.catsByColor.set(cat.color, new Set());
    }
    this.catsByColor.get(cat.color)!.add(cat.id);
  }

  save(cat:Cat)
  {
    this.catsById.set(cat.id, cat)
    this.AddcatsByColor(cat);
  }

  update(id:string, cat:Cat)
  {
    this.catsById.set(id, cat);
    
    this.catsByColor.get(cat.color)?.delete(id);
    this.AddcatsByColor(cat);
  }

  remove(id:string,cat:Cat)
  {
    this.catsById.delete(id);
    this.catsByColor.get(cat.color)?.delete(id);
  }

  findAll()
  {
    return Array.from(this.catsById.values());
  }

  findOne(id:string)
  {
    const cat = this.catsById.get(id);
    return cat;
  }

  filterByColor(color: CatColor)
  {
    const ids = this.catsByColor.get(color);
    if (!ids) return [];

    return Array.from(ids).map(id => this.catsById.get(id)!);
  }
}