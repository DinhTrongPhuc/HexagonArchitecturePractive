import { CreateNoteUseCase, CreateNoteRequest } from "../../../../ports/inbound/usecases/CreateNoteUseCase";
import { ListNoteUseCase } from "../../../../ports/inbound/usecases/ListNoteUseCase";
import { UpdateNoteRequest, UpdateNoteUseCase } from "../../../../ports/inbound/usecases/UpdateNoteUseCase";
import { DeleteNoteUseCase } from "../../../../ports/inbound/usecases/DeleteNoteUseCase";

export class NoteComand {
    constructor(
        private createNoteUseCase: CreateNoteUseCase,
        private listNoteUseCase: ListNoteUseCase,
        private updateNoteUseCase: UpdateNoteUseCase,
        private deleteNoteUseCase: DeleteNoteUseCase
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
                        const notes = await this.listNoteUseCase.execute();
                        console.log(notes.map(n => ({
                            id: n.id,
                            title: n.title.getValue(),
                            content: n.content.getValue(),
                            tags: n.tag.getValue().map((t) => t.getValue()).join(','),
                            reporter: n.reporter.getValue(),
                            createdAt: n.createdAt,
                            updateAt: n.updateAt
                        }))); break;
                    case "update":
                        const idUpdate = args[2];
                        const titleUpdate = args[3];
                        const contentUpdate = args[4];
                        const tagsUpdate = args[5];
                        const reporterUpdate = args[6];
                        if (!idUpdate || !titleUpdate || !contentUpdate || !tagsUpdate || !reporterUpdate) {
                            console.log("Missing arguments");
                            break;
                        }
                        const requestUpdate: UpdateNoteRequest = {
                            id: idUpdate,
                            title: titleUpdate,
                            content: contentUpdate,
                            tags: tagsUpdate,
                            reporter: reporterUpdate
                        };
                        const resultUpdate = await this.updateNoteUseCase.execute(requestUpdate);
                        console.log("[CLI] Note updated successfully:", resultUpdate.id);
                        break;
                    case "delete":
                        const idDelete = args[2];
                        if (!idDelete) {
                            console.log("Missing arguments");
                            break;
                        }
                        await this.deleteNoteUseCase.execute(idDelete);
                        console.log("[CLI] Note deleted successfully:", idDelete);
                        break;
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