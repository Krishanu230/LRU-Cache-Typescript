import {LRUItem, LRUCache } from './../lru'
import {Storage} from './storage'
import fs = require('fs');
import {parse, stringify, toJSON, fromJSON} from 'flatted';
//ref: https://nodejs.org/api/fs.html#file-system

export class LRUStorage implements Storage {
    public filePath: string;

    constructor(path: string, cache: LRUCache) {
        this.filePath = path
        if (!fs.existsSync(this.filePath)) {
            this.makeEmptyCache(cache)
        }
    }

    public clear(): void{
      var c1 = new LRUCache()
      this.makeEmptyCache(c1)
    }

    private makeEmptyCache(cache: LRUCache): void {
        try {
          fs.writeFileSync(this.filePath, stringify(cache))
        } catch (err) {
          console.error(err)
        }
    }

    public getCache(): any {
        return parse(
            (fs.readFileSync(this.filePath)).toString()
        )
    }

    public setCache(updatedCache: LRUCache): any{
      try {
        fs.writeFileSync(this.filePath, stringify(updatedCache))
      } catch (err) {
        console.error(err)
      }
    }
}
