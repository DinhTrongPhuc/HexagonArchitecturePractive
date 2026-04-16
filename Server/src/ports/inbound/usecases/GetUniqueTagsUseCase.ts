export interface GetUniqueTagsUseCase {
    execute(): Promise<string[]>;
}
