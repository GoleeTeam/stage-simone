import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Cat } from '../domain/cat.class';
import { CatColor } from '../domain/cats.color.enum';
import { CreateCatInput } from './input/createCatInput';

import { CATS_REPOSITORY, CatsService } from './cats.service';
import { CatsInMemoryRepository } from '../infrastructure/repo/catsInMemory.repository';
import { CatsRepository } from './ports/cats.repository';

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

  const createCatInput: CreateCatInput = {
    name: 'Whiskers',
    age: 3,
    color: CatColor.BLACK,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CATS_REPOSITORY,
          useClass: CatsInMemoryRepository,
        },
        CatsService,
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    repo = module.get<CatsRepository>(CATS_REPOSITORY);
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create a cat and return message with id', async () => {
      const result = await service.create(createCatInput);

      expect(result).toEqual({
        message: 'cat created',
        id: 'mock-uuid-1234',
      });
    });
  });

  // ---------------- UPDATE ----------------
  describe('update', () => {
    it('should update an existing cat', async () => {
      await service.create(createCatInput);

      const input: CreateCatInput = {
        name: 'Felix',
        age: 5,
        color: CatColor.WHITE,
      };

      const result = await service.update(catFixture.id, input);

      expect(result).toEqual({
        message: 'cat updated',
        id: catFixture.id,
      });
    });

    it('should throw if cat not found', async () => {
      await expect(
        service.update('bad-id', createCatInput),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------- REMOVE ----------------
  describe('remove', () => {
    it('should remove an existing cat', async () => {
      await service.create(createCatInput);

      const result = await service.remove(catFixture.id);

      expect(result).toEqual({
        message: 'Cat deleted',
        id: catFixture.id,
      });
    });

    it('should throw if cat not found', async () => {
      await expect(
        service.remove('bad-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------- FIND ALL ----------------
  describe('findAll', () => {
    it('should return all cats', async () => {
      await service.create(createCatInput);

      const result = await service.findAll();

      expect(result).toEqual([catFixture]);
    });
  });

  // ---------------- FILTER BY COLOR ----------------
  describe('filterByColor', () => {
    it('should return cats of given color', async () => {
      await service.create(createCatInput);

      const result = await service.filterByColor(CatColor.BLACK);

      expect(result).toEqual([catFixture]);
    });

    it('should return empty array if no cats match', async () => {
      const result = await service.filterByColor(CatColor.WHITE);

      expect(result).toEqual([]);
    });
  });

  // ---------------- FIND ONE ----------------
  describe('findOne', () => {
    it('should return a cat', async () => {
      await service.create(createCatInput);

      const result = await service.findOne(catFixture.id);

      expect(result).toEqual(catFixture);
    });

    it('should throw if cat not found', async () => {
      await expect(
        service.findOne('bad-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
