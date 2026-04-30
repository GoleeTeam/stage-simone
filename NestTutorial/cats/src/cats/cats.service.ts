export const CATS_REPOSITORY = 'CATS_REPOSITORY';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Cat } from './domain/cat.class';
import { CatColor } from './domain/cats.color.enum';
import { CreateCatDto } from './dto/createCat.dto';
import { CatsRepository } from './repo/cats.repository';
import { CatsInMemoryRepository } from './repo/catsInMemory.repository';
import { CatsCrud } from './cats.crud';
import { MessageCat } from './dto/messageCat.dto';

@Injectable()
export class CatsService implements CatsCrud{
  constructor(
    @Inject(CATS_REPOSITORY)
    private readonly repo: CatsRepository,
  ) {}

  async create(catDto: CreateCatDto): Promise<MessageCat>  {
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

  async update(id: string, catDto: CreateCatDto): Promise<MessageCat>  {
    const cat = await this.repo.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    const toUpdateCat: Cat = {
      id: cat.id,
      name: catDto.name,
      age: catDto.age,
      color: catDto.color,
    };

    await this.repo.update(toUpdateCat.id, toUpdateCat);

    const res: MessageCat = {
      message:'cat updated',
      id: toUpdateCat.id 
    }
    return res;
  }

  async remove(id: string): Promise<MessageCat>  {
    const cat = await this.repo.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    await this.repo.remove(id);

    const res: MessageCat = {
      message:'Cat deleted',
      id: id 
    }
    return res;
  }

  async findAll() {
    return await this.repo.findAll();
  }

  async filterByColor(color: CatColor) {
    const cats = await this.repo.filterByColor(color);
    return cats;
  }

  async findOne(id: string) {
    const cat = await this.repo.findOne(id);
    
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    return cat;
  }
}
