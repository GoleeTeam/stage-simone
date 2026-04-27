import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/createCat.dto';
import { Cat } from './domain/cat.interface';
import { CatColor } from './domain/cats.color.enum';

describe('CatsController', () => {
  let controller: CatsController;
  let service: jest.Mocked<CatsService>;

  const VALID_UUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  const mockCat: Cat = {
    id: VALID_UUID,
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
    const mockService: jest.Mocked<CatsService> = {
      findAll: jest.fn(),
      filterByColor: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [{ provide: CatsService, useValue: mockService }],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get(CatsService);
  });

  // findAll

  describe('findAll', () => {
    it('should return all cats', async () => {
      service.findAll.mockReturnValue([mockCat]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockCat]);
    });

    it('should return empty array when no cats exist', async () => {
      service.findAll.mockReturnValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  // findByColor

  describe('findByColor', () => {
    it('should return cats by color', () => {
      service.filterByColor.mockReturnValue([mockCat]);

      const result = controller.findByColor({
        color: CatColor.BLACK,
      });

      expect(service.filterByColor).toHaveBeenCalledWith(CatColor.BLACK);
      expect(result).toEqual([mockCat]);
    });

    it('should throw if no cats found', () => {
      service.filterByColor.mockImplementation(() => {
        throw new Error('Color not found');
      });

      expect(() => controller.findByColor({ color: CatColor.WHITE })).toThrow();
    });
  });

  // findOne

  describe('findOne', () => {
    it('should return a cat by id', () => {
      service.findOne.mockReturnValue(mockCat);

      const result = controller.findOne(VALID_UUID);

      expect(service.findOne).toHaveBeenCalledWith(VALID_UUID);
      expect(result).toEqual(mockCat);
    });

    it('should throw if cat not found', () => {
      service.findOne.mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.findOne(VALID_UUID)).toThrow(NotFoundException);
    });
  });

  // create

  describe('create', () => {
    it('should create a cat', async () => {
      service.create.mockReturnValue({
        message: 'cat created',
        id: VALID_UUID,
      });

      const result = await controller.create(createCatDto);

      expect(service.create).toHaveBeenCalledWith(createCatDto);
      expect(result).toEqual({
        message: 'cat created',
        id: VALID_UUID,
      });
    });
  });

  // update

  describe('update', () => {
    const updateDto: CreateCatDto = {
      name: 'Felix',
      age: 5,
      color: CatColor.WHITE,
    };

    it('should update a cat', () => {
      service.update.mockReturnValue({
        message: 'cat updated',
        id: VALID_UUID,
      });

      const result = controller.update(VALID_UUID, updateDto);

      expect(service.update).toHaveBeenCalledWith(VALID_UUID, updateDto);
      expect(result).toEqual({
        message: 'cat updated',
        id: VALID_UUID,
      });
    });
  });

  // remove

  describe('remove', () => {
    it('should remove a cat', () => {
      service.remove.mockReturnValue({
        message: 'Cat deleted',
        id: VALID_UUID,
      });

      const result = controller.remove(VALID_UUID);

      expect(service.remove).toHaveBeenCalledWith(VALID_UUID);
      expect(result).toEqual({
        message: 'Cat deleted',
        id: VALID_UUID,
      });
    });
  });
});
