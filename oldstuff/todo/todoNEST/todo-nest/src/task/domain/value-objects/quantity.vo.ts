export class Quantity {
  private constructor(private readonly value: number) {}

  static create(value: number): Quantity {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Quantity must be a positive integer or zero');
    }

    return new Quantity(value);
  }

  toNumber(): number {
    return this.value;
  }
}
