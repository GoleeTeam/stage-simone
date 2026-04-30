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
import { FilterCatDto } from './dto/filterCatColor.dto';
import { CatsCrud } from './cats.crud';

@Controller('cats')
export class CatsController {
  constructor(
      @Inject(CATS_SERVICE)
      private readonly catsService: CatsCrud,
    ) {}

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get('search')
  findByColor(@Query() query: FilterCatDto) {
    return this.catsService.filterByColor(query.color);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.catsService.findOne(id);
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createCatDto: CreateCatDto,
  ) {
    return this.catsService.update(id, createCatDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.catsService.remove(id);
  }
}
