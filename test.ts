import {LRUCache} from './lru'
var c = new LRUCache(
  LRUCache.WithMax(3),
  LRUCache.WithMaxAge(5001)
)

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

c.set("k1", "v1")
c.set("k2", "v2")
setTimeout(() => {  console.log(c.get("k2")); }, 2000);
setTimeout(() => {  console.log(c.get("k2")); }, 11000);
