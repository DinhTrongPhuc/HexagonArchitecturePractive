export class Tag {
  constructor(private readonly value: string) {
    if (!value || value.trim() === "") {
      throw new Error("Tags must not be empty");
    }
    if (value.length < 3) {
      throw new Error("Tags must be at least 3 characters long");
    }
    if (value.length > 100) {
      throw new Error("Tags must be less than 100 characters long");
    }

    this.value = value;
  }
  getValue(): string {
    return this.value;
  }
}
