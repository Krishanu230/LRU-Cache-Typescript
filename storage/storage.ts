export interface Storage {
    getItem(key: any): Promise<any>

    setItem(key: any, content: any): Promise<void>

    clear(): Promise<void>
}
