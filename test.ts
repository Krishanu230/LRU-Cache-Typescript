import {LRUCache} from './lru'
var c = new LRUCache(
  LRUCache.WithMax(3),
  LRUCache.WithMaxAge(1000)
)

c.set("k1", "v1")
c.set("k2", "v2")
console.log(c.get("k1"))
c.set("k3", "v3")
c.set("k4", "v4")
console.log(c.get("k1"))
console.log(c.get("k2"))
console.log(c.get("k3"))
console.log(c.get("k4"))
