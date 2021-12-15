export interface Storage {
    getCache(key: any): any

    setCache(key: any, content: any): void

    clear(): void
}
