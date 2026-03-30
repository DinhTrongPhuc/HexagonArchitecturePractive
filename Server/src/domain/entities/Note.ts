import { Title } from "../value-object/Title";
import { Content } from "../value-object/Content";
import { Email } from "../value-object/Email";
import { TagList } from "../value-object/NoteTag/TagList";

export class Note {
  constructor(
    private readonly _id: string,
    private _title: Title,
    private _content: Content,
    private _tag: TagList, // tag[]
    private _reporter: Email,
    private readonly _createdAt: Date,
    private _updateAt: Date
  ) { }

  // Getters-----------------------------
  get title(): Title {
    return this._title;
  }
  get content(): Content {
    return this._content;
  }
  get tag(): TagList {
    return this._tag;
  }
  get reporter(): Email {
    return this._reporter;
  }
  get updateAt(): Date {
    return this._updateAt;
  }
  // readonly attributes
  get id(): string {
    return this._id;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  //Domain behaviors---------------------
  updateTitle(newTitle: Title) {
    this._title = newTitle;
    this._updateAt = new Date();
  }
  updateContent(newContent: Content) {
    this._content = newContent;
    this._updateAt = new Date();
  }
  updateTags(newTag: TagList) {
    this._tag = newTag;
    this._updateAt = new Date();
  }
}
