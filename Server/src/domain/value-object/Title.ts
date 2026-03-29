export class Title {
  constructor(private readonly value: string) {
    if (!value || value.trim() === "") {
      throw new Error("Title must not be empty");
    }
    if (value.length < 3) {
      throw new Error("Title must be at least 3 characters long");
    }
    if (value.length > 255) {
      throw new Error("Title must be less than 255 characters long");
    }
    this.value = value;
  }
  getValue(): string {
    return this.value;
  }
}
