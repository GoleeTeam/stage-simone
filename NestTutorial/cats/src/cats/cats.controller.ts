import { Controller, Get, Post, Body, Query, Put, Delete, Param} from '@nestjs/common';
import { CreateCatDto } from './createCat.dto';
import { CatsService } from './cats.service';
import { Cat } from './cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    console.log('findAll');
    return this.catsService.findAll();
  }

  @Get('search')
  findByColor(@Query('color') color:string){
    console.log('findByColor');
    if (!color)
      return 'color is required';
    return this.catsService.findByColor(color);
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    console.log('findOne', id);
    if(!id)
      return 'id is required';
    return this.catsService.findOne(id);
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    console.log('create');
    return this.catsService.create(createCatDto);
  }

  @Put(':id')
  update(@Param('id') id:string, @Body() CreateCatDto: CreateCatDto) {
    console.log('updateDto');
    if(!id)
      return 'id is required';
    return this.catsService.update(id, CreateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('delete');
    if(!id)
      return 'id is required';
    return this.catsService.remove(id);
  }
}
