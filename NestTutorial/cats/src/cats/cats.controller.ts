import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { CreateCatDto } from './dto/createCat.dto';
import { FilterCatDto } from './dto/filterCatColor.dto';
import { CatsService } from './cats.service';
import { Cat } from './interface/cat.interface';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll() {
    console.log('findAll');
    return this.catsService.findAll();
  }

  @Get('search')
  findByColor(@Query() query: FilterCatDto) {
    console.log('findByColor');
    return this.catsService.filterByColor(query.color);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    console.log('findOne', id);
    return this.catsService.findOne(id);
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    console.log('create');
    return this.catsService.create(createCatDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() CreateCatDto: CreateCatDto,
  ) {
    console.log('updateDto');
    return this.catsService.update(id, CreateCatDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log('delete');
    return this.catsService.remove(id);
  }
}
