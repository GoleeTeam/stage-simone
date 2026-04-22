import { Injectable } from '@nestjs/common';
import { Cat } from './cat.interface';
import { CreateCatDto } from './createCat.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(createCatDto: CreateCatDto) {
    const cat: Cat = {
    id: uuid(),
    name: createCatDto.name,
    age: createCatDto.age,
    color: createCatDto.color,
  };

  this.cats.push(cat);
  return {message:"cat created", id:cat.id};
}

  update(id:string, CreateCatDto: CreateCatDto) {
    for(const cat of this.cats)
    {   
        if (id === cat.id)
        {
            cat.name=CreateCatDto.name;
            cat.age=CreateCatDto.age;
            cat.color=CreateCatDto.color;
            return {message:"cat updated",id:id};
        }
    }
    return 'Cat not found';
  };

  findAll(): Cat[] {
    return this.cats;
  }

  findByColor(color:string){
    return this.cats.filter(cat => cat.color?.toLowerCase() === color?.toLowerCase());
  }

  findOne(id: string){
    for(const cat of this.cats)
    {
      if(cat.id===id)
        return cat;
    }
    return "cat don't exist";
  }


  remove(id: string) {
    console.log('delete');
    
    const index = this.cats.findIndex(cat => cat.id === id);
    if (index === -1) {
    return "this cat don't exist";
    }
    this.cats.splice(index, 1);
	
	return {message: 'Cat deleted', id};
    }
}
