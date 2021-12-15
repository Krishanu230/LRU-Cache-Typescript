import {LRUItem, LRUCache, LRUCacheOption } from './lru'
import {LRUStorage } from './storage/lru-storage'

export class LRUCacheDisk {
  public storage: LRUStorage;
  public lruMem: LRUCache;

  constructor ( path: string, ...options: LRUCacheOption[]) {
    this.lruMem = new LRUCache(...options)
    this.storage = new LRUStorage(path, this.lruMem)
  }

  public set_disk(key, value, age?:number): void  {
    const raw = this.storage.getCache()
    this.lruMem.load(raw.MAX_ITEMS, raw.CUR_ITEMS, raw.MAX_AGE, raw.hashTable, raw.head, raw.tail)
    this.lruMem.set(key, value, age)
    this.storage.setCache(this.lruMem)
  }

  public get_disk(key: any): any {
    const raw = this.storage.getCache()
    return this.lruMem.get(key)
  }
}
