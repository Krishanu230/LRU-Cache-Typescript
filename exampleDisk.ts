import {LRUCache} from './lru'
import {LRUCacheDisk} from './lru-disk'


var c = new LRUCacheDisk(
  "test.json",
  LRUCache.WithMax(3),
  LRUCache.WithMaxAge(5001),
)
c.set_disk("k2", "v2")
console.log(c.get_disk('k2'))
