export class Content {
  constructor(private readonly value: string) {
    if (!value || value.trim() === "") {
      throw new Error("Content must not be empty");
    }
    if (value.length < 3) {
      throw new Error("Content must be at least 3 characters long");
    }
    if (value.length > 1000) {
      throw new Error("Content must be less than 255 characters long");
    }
    this.value = value;
  }
  getValue(): string {
    return this.value;
  }
}
