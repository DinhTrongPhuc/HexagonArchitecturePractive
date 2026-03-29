export class Email {
  constructor(private readonly value: string) {
    if (!value || value.trim() === "") {
      throw new Error("Email must not be empty");
    }
    if (!value.includes("@")) {
      throw new Error("Email must be a valid email address");
    }
    if (value.length > 255) {
      throw new Error("Email must be less than 255 characters long");
    }
    this.value = value;
  }
  getValue(): string {
    return this.value;
  }
}
