import { TaskPriority } from '../../domain/task-priority.enum';

export class CreateTaskDto {
  name!: string;
  deadline!: string;
  priority!: TaskPriority;
}
