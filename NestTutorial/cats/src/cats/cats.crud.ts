
import { Cat } from './domain/cat.interface';
import { CatColor } from './domain/cats.color.enum';
import { CreateCatDto } from './dto/createCat.dto';
import { MessageCat } from './domain/messageCat.interface';

export interface CatsCrud {

  create(catDto: CreateCatDto): MessageCat;

  update(id: string, catDto: CreateCatDto): MessageCat;

  remove(id: string): MessageCat;

  findAll(): void;

  filterByColor(color: CatColor): Cat[];

  findOne(id: string): Cat;
}
