import { Test, TestingModule } from '@nestjs/testing';
import { TaskApplicationService } from './application/task.application-service';
import { TaskController } from './task.controller';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskApplicationService,
          useValue: {
            newTask: jest.fn(),
            startTask: jest.fn(),
            getWorkerState: jest.fn(),
            getExpiredTasks: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
