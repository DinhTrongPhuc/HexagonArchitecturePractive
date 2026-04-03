export interface ReadNoteUseCase {
    execute(id: string): Promise<any>;
}
