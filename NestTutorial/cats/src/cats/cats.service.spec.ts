import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cat } from './domain/cat.interface';
import { CatColor } from './domain/cats.color.enum';
import { CreateCatDto } from './dto/createCat.dto';
import { ColorNotFoundException } from './exceptions/color-not-found.exception';
import { CatsInMemoryRepository } from './repo/catsInMemory.repository';
import { CATS_REPOSITORY, CatsService } from './cats.service';
import { CatsRepository } from './repo/cats.repository';
import { CatsFakeRepository } from './repo/catsFake.repository';
import { CATS_SERVICE } from './cats.controller';

jest.mock('uuid', () => ({ v4: () => 'mock-uuid-1234' }));

describe('CatsService', () => {
  let service: CatsService;
  let repo: CatsRepository;

  const catFixture: Cat = {
    id: 'mock-uuid-1234',
    name: 'Whiskers',
    age: 3,
    color: CatColor.BLACK,
  };

  const createCatDto: CreateCatDto = {
    name: 'Whiskers',
    age: 3,
    color: CatColor.BLACK,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CATS_SERVICE,
          useClass: CatsService,
        },
        {
          provide: CATS_REPOSITORY,
          useClass: CatsFakeRepository,
        },
      ],
    }).compile();

    service = module.get(CATS_SERVICE);
    repo = module.get(CATS_REPOSITORY);
  });

  describe('create', () => {
    it('should save a new cat and return id', () => {
      const result = service.create(createCatDto);

      expect(result).toEqual({
        message: 'cat created',
        id: 'mock-uuid-1234',
      });
    });
  });

  describe('update', () => {
    it('should update an existing cat', () => {
      const dto: CreateCatDto = {
        name: 'Felix',
        age: 5,
        color: CatColor.WHITE,
      };
      service.create(createCatDto);

      const result = service.update(catFixture.id, dto);

      expect(result).toEqual({
        message: 'cat updated',
        id: catFixture.id,
      });
    });

    it('should throw if cat not found', () => {
      expect(() => service.update('bad-id', createCatDto)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing cat', () => {
      service.create(createCatDto);

      const result = service.remove(catFixture.id);

      expect(result).toEqual({
        message: 'Cat deleted',
        id: catFixture.id,
      });
    });

    it('should throw if cat not found', () => {
      expect(() => service.remove('bad-id')).toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all cats', () => {
      service.create(createCatDto);

      repo.findAll();

      const result = service.findAll();

      expect(result).toEqual([catFixture]);
    });
  });

  describe('filterByColor', () => {
    it('should return cats of given color', () => {
      service.create(createCatDto);

      const result = service.filterByColor(CatColor.BLACK);

      expect(result).toEqual([catFixture]);
    });

    it('should return []', () => {
      const result = service.filterByColor(CatColor.WHITE);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a cat', () => {
      service.create(createCatDto);

      const result = service.findOne(catFixture.id);

      expect(result).toEqual(catFixture);
    });

    it('should throw if cat not found', () => {
      expect(() => service.findOne('bad-id')).toThrow(NotFoundException);
    });
  });
});
