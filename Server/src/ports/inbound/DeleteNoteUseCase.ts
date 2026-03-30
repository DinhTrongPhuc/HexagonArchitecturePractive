export interface DeleteNoteUseCase {
    execute(id: string): Promise<void>
}