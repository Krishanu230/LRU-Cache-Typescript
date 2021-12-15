import {LRUItem, LRUCache, LRUCacheOption } from './lru'
import {LRUStorage } from './storage/lru-storage'

export class LRUCacheDisk {
  public storage: LRUStorage;
  public lruMem: LRUCache;

  constructor ( path: string, ...options: LRUCacheOption[]) {
    this.lruMem = new LRUCache(...options)
    this.storage = new LRUStorage(path, this.lruMem)
  }

  public async set_disk(key, value, age?:number)  {
    const raw = await this.storage.getCache().catch((err) => { console.error(err); });
    console.log("before reading")
    this.lruMem.dump()
    this.lruMem.load(raw.MAX_ITEMS, raw.CUR_ITEMS, raw.MAX_AGE, raw.hashTable, raw.head, raw.tail)
    console.log("after reading")
    this.lruMem.dump()
    this.lruMem.set(key, value, age)
    console.log("after setting")
    this.lruMem.dump()
    console.log("after here")
    await this.storage.setCache(this.lruMem).catch((err) => { console.error(err); });
  }

  public async get_disk(key: any) : Promise<any> {
    const raw = await this.storage.getCache().catch((err) => { console.error(err); });
    console.log("raw is")
    console.log(raw.MAX_ITEMS, raw.CUR_ITEMS, raw.MAX_AGE, raw.hashTable, raw.head, raw.tail)
    this.lruMem.load(raw.MAX_ITEMS, raw.CUR_ITEMS, raw.MAX_AGE, raw.hashTable, raw.head, raw.tail)
    console.log("reading")
    this.lruMem.dump()
    return this.lruMem.get(key)
  }
}
