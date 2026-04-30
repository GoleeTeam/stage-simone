export const CATS_REPOSITORY = 'CATS_REPOSITORY';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Cat } from './domain/cat.interface';
import { CatColor } from './domain/cats.color.enum';
import { CreateCatDto } from './dto/createCat.dto';
import { CatsRepository } from './repo/cats.repository';
import { CatsInMemoryRepository } from './repo/catsInMemory.repository';
import { CatsCrud } from './cats.crud';
import { MessageCat } from './domain/messageCat.interface';

@Injectable()
export class CatsService implements CatsCrud{
  constructor(
    @Inject(CATS_REPOSITORY)
    private readonly repo: CatsRepository,
  ) {}

  create(catDto: CreateCatDto) {
    const newCat: Cat = {
      id: uuid(),
      name: catDto.name,
      age: catDto.age,
      color: catDto.color,
    };

    this.repo.save(newCat);

    const res: MessageCat = {
      message:'cat created',
      id: newCat.id 
    }
    return res;
  }

  update(id: string, catDto: CreateCatDto) {
    const cat = this.repo.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    const toUpdateCat: Cat = {
      id: cat.id,
      name: catDto.name,
      age: catDto.age,
      color: catDto.color,
    };

    this.repo.update(toUpdateCat.id, toUpdateCat);

    const res: MessageCat = {
      message:'cat updated',
      id: toUpdateCat.id 
    }
    return res;
  }

  remove(id: string) {
    const cat = this.repo.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    this.repo.remove(id, cat.color);

    const res: MessageCat = {
      message:'Cat deleted',
      id: id 
    }
    return res;
  }

  findAll() {
    return this.repo.findAll();
  }

  filterByColor(color: CatColor) {
    const cats = this.repo.filterByColor(color);
    return cats;
  }

  findOne(id: string) {
    const cat = this.repo.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    return cat;
  }
}
