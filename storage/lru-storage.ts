import {LRUItem, LRUCache } from './../lru'
import {Storage} from './storage'
import fs_p = require('fs.promises');
import fs = require('fs');
//ref: https://nodejs.org/api/fs.html#file-system

export class LRUStorage implements Storage {
    public filePath: string;

    constructor(path: string, cache: LRUCache) {
        this.filePath = path
        if (!fs.existsSync(this.filePath)) {
            this.makeEmptyCache(cache)
        }
    }
    public async getItem(key: any): Promise<any> {
      return (await this.getCache())[key]
    }

    public async setItem(key: any, content: LRUItem): Promise<void> {
      const cache = await this.getCache()
      cache[key] = content
      await this.setCache(cache)
    }

    public async clear(): Promise<void>{
      var c1 = new LRUCache()
      await this.makeEmptyCache(c1)
    }

    private makeEmptyCache(cache: LRUCache): void {
        fs.writeFileSync(this.filePath, JSON.stringify(cache))
    }

    public async getCache(): Promise<any> {
        return JSON.parse(
            (await fs_p.readFile(this.filePath)).toString()
        )
    }

    public async setCache(updatedCache: LRUCache): Promise<any> {
        await fs_p.writeFile(this.filePath, JSON.stringify(updatedCache)).catch((err) => { console.error(err); });
    }
}
