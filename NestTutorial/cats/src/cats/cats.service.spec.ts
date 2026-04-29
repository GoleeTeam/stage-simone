import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cat } from './domain/cat.interface';
import { CatColor } from './domain/cats.color.enum';
import { CreateCatDto } from './dto/createCat.dto';
import { ColorNotFoundException } from './exceptions/color-not-found.exception';
import { CatsInMemoryRepository } from './repo/catsInMemory.repository';
import { CatsService } from './cats.service';

jest.mock('uuid', () => ({ v4: () => 'mock-uuid-1234' }));

describe('CatsService', () => {
  let service: CatsService;
  let repo: jest.Mocked<CatsInMemoryRepository>;

  const mockCat: Cat = {
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

  beforeAll(async () => {
    const repoMock: jest.Mocked<CatsInMemoryRepository> = {
      save: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      filterByColor: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        { provide: CatsInMemoryRepository, useValue: repoMock },
      ],
    }).compile();

    service = module.get(CatsService);
    repo = module.get(CatsInMemoryRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should save a new cat and return id', () => {
      const result = service.create(createCatDto);

      expect(repo.save).toHaveBeenCalledWith({
        id: 'mock-uuid-1234',
        name: createCatDto.name,
        age: createCatDto.age,
        color: createCatDto.color,
      });

      expect(result).toEqual({
        message: 'cat created',
        id: 'mock-uuid-1234',
      });
    });
  });

  describe('update', () => {
    it('should update an existing cat', () => {
      repo.findOne.mockReturnValue(mockCat);

      const dto: CreateCatDto = {
        name: 'Felix',
        age: 5,
        color: CatColor.WHITE,
      };

      const result = service.update(mockCat.id, dto);

      expect(repo.findOne).toHaveBeenCalledWith(mockCat.id);
      expect(repo.update).toHaveBeenCalledWith(mockCat.id, {
        id: mockCat.id,
        name: dto.name,
        age: dto.age,
        color: dto.color,
      });

      expect(result).toEqual({
        message: 'cat updated',
        id: mockCat.id,
      });
    });

    it('should throw if cat not found', () => {
      repo.findOne.mockReturnValue(undefined);

      expect(() => service.update('bad-id', createCatDto)).toThrow(
        NotFoundException,
      );

      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an existing cat', () => {
      repo.findOne.mockReturnValue(mockCat);

      const result = service.remove(mockCat.id);

      expect(repo.findOne).toHaveBeenCalledWith(mockCat.id);
      expect(repo.remove).toHaveBeenCalledWith(mockCat.id, mockCat.color);

      expect(result).toEqual({
        message: 'Cat deleted',
        id: mockCat.id,
      });
    });

    it('should throw if cat not found', () => {
      repo.findOne.mockReturnValue(undefined);

      expect(() => service.remove('bad-id')).toThrow(NotFoundException);

      expect(repo.remove).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all cats', () => {
      const cats: Cat[] = [mockCat, { ...mockCat, id: '2', name: 'Luna' }];

      repo.findAll.mockReturnValue(cats);

      const result = service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(cats);
    });
  });

  describe('filterByColor', () => {
    it('should return cats of given color', () => {
      repo.filterByColor.mockReturnValue([mockCat]);

      const result = service.filterByColor(CatColor.BLACK);

      expect(repo.filterByColor).toHaveBeenCalledWith(CatColor.BLACK);
      expect(result).toEqual([mockCat]);
    });

    it('should return []', () => {
      repo.filterByColor.mockReturnValue([]);
      const result = service.filterByColor(CatColor.WHITE);

      expect(repo.filterByColor).toHaveBeenCalledWith(CatColor.WHITE);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a cat', () => {
      repo.findOne.mockReturnValue(mockCat);

      const result = service.findOne(mockCat.id);

      expect(repo.findOne).toHaveBeenCalledWith(mockCat.id);
      expect(result).toEqual(mockCat);
    });

    it('should throw if cat not found', () => {
      repo.findOne.mockReturnValue(undefined);

      expect(() => service.findOne('bad-id')).toThrow(NotFoundException);
    });
  });
});
