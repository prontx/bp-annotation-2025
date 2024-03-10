export interface Lookup<T> {
    keys: string[],
    entities: Record<string, T>
}
