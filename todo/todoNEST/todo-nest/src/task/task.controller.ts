import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TaskApplicationService } from './application/task.application-service';
import { CreateTaskDto } from './presentation/dto/create-task.dto';

@Controller('workers')
export class TaskController {
  constructor(
    private readonly taskApplicationService: TaskApplicationService,
  ) {}

  @Post(':workerId/tasks')
  createTask(@Param('workerId') workerId: string, @Body() input: CreateTaskDto) {
    return this.taskApplicationService.newTask(
      workerId,
      input.name,
      input.deadline,
      input.priority,
    );
  }

  @Post(':workerId/tasks/:taskId/start')
  startTask(
    @Param('workerId') workerId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.taskApplicationService.startTask(workerId, taskId);
  }

  @Get(':workerId/tasks')
  getTasks(
    @Param('workerId') workerId: string,
    @Query('expired') expired?: string,
  ) {
    if (expired === 'true') {
      return this.taskApplicationService.getExpiredTasks(workerId);
    }

    return this.taskApplicationService.getWorkerState(workerId);
  }
}
