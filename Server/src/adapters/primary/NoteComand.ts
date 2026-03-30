import { CreateNoteUseCase, CreateNoteRequest } from "../../ports/inbound/CreateNoteUseCase";
import { ListNoteUsecase } from "../../ports/inbound/ListNoteUsecase";

export class NoteComand {
    constructor(
        private createNoteUseCase: CreateNoteUseCase,
        private listNoteUsecase: ListNoteUsecase
    ) { }
    async run(args: string[]) {
        const [entity, action] = args;
        switch (entity) {
            case "note":
                switch (action) {
                    case "create":

                        const title = args[2];
                        const content = args[3];
                        const tags = args[4];
                        const reporter = args[5];

                        if (!title || !content || !tags || !reporter) {
                            console.log("Missing arguments");
                            break;
                        }
                        const request: CreateNoteRequest = {
                            title,
                            content,
                            tags,
                            reporter
                        };
                        const result = await this.createNoteUseCase.execute(request);
                        console.log("[CLI] Note created successfully:", result.id);
                        break;
                    case "read":
                        const notes = await this.listNoteUsecase.execute();
                        console.log(notes.map(n => ({
                            id: n.id,
                            title: n.title.getValue(),
                            content: n.content.getValue(),
                            tags: n.tag.getValue().map((t) => t.getValue()).join(','),
                            reporter: n.reporter.getValue(),
                            createdAt: n.createdAt,
                            updateAt: n.updateAt
                        }))); break;
                    default:
                        console.log("Comands unknown action");
                        break;
                }
                break;
            default:
                console.log("Comands unknown entity");
                break;
        }
    }
}   