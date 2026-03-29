import { Tag } from "./Tag";

export class TagList {
  constructor(private readonly value: Tag[]) {
    // max 3 tags
    if (value.length > 3) {
      throw new Error("A Note can have at most 3 tags");
    }

    //check duplicate tags
    const tagNames = value.map((t) => t.getValue().trim().toLowerCase());

    if (new Set(tagNames).size !== tagNames.length) {
      throw new Error("Tags cannot be duplicated");
    }
  }

  getValue(): Tag[] {
    return this.value;
  }

  static fromString(tagString: string): TagList {
    if (!tagString || tagString.trim() === "") {
      return new TagList([]);
    }

    const tags = tagString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tagName) => tagName !== "")
      .map((tagName) => new Tag(tagName));

    return new TagList(tags);
  }
}
