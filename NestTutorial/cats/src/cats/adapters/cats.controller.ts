export const CATS_SERVICE = 'CATS_SERVICE';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCatDto } from './dto/createCat.dto';
import { FilterCatColorDto } from './dto/filterCatColor.dto';
import { CatsCrud } from '../application/ports/cats.crud';
import { mapCat } from './map/mapCat';
import { mapCatColor } from './map/mapCatColor';

@Controller('cats')
export class CatsController{
  constructor(
      @Inject(CATS_SERVICE)
      private readonly catsService: CatsCrud,
    ) {}

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get('search')
  filterByColor(@Query() query: FilterCatColorDto) {
    const input = mapCatColor(query.color);
    return this.catsService.filterByColor(input);
  }                                            

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.catsService.findOne(id);
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    const input = mapCat(createCatDto);
    return this.catsService.create(input);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createCatDto: CreateCatDto,
  ) {
    const input = mapCat(createCatDto);
    return this.catsService.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.catsService.remove(id);
  }
}
