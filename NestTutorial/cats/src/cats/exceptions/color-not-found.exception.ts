import { NotFoundException } from '@nestjs/common';

export class ColorNotFoundException extends NotFoundException {
  constructor(color: string) {
    super(`No cats found with color "${color}"`);
  }
}
