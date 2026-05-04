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
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/createCat.dto';
import { FilterCatColoriDto } from './dto/filterCatColori.dto';
import { CatsCrud } from './cats.crud';
import { mapGatto } from './dto/map/mapGatto';
import { CreateGattoDto } from './dto/createGatto.dto';
import { mapCatColori } from './dto/map/mapCatColori';

@Controller('gatti')
export class GattiController{
  constructor(
      @Inject(CATS_SERVICE)
      private readonly catsService: CatsCrud,
    ) {}

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get('cerca')
  filterByColor(@Query() query: FilterCatColoriDto) {
    const input = mapCatColori(query.color);
    return this.catsService.filterByColor(input);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.catsService.findOne(id);
  }

  @Post()
  create(@Body() createGattoDto: CreateGattoDto) {
    const input = mapGatto(createGattoDto);
    return this.catsService.create(input);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createGattoDto: CreateGattoDto,
  ) {
    const input = mapGatto(createGattoDto);
    return this.catsService.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.catsService.remove(id);
  }
}
