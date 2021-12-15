import {LRUCache} from './lru'

var c2 = new LRUCache(
  LRUCache.WithMax(3),
)

c2.set("k1", "v1")
c2.set("k2", "v2")
c2.set("k3", "v3")
//c2.dump()
console.log(c2.get("k1")); //now k1 is not the least recently used, k2 is
c2.set("k4", "v4") //k2 will be popped out
console.log(c2.get("k2")); //-1

console.log("---next example---")
var c = new LRUCache(
  LRUCache.WithMax(3),
  LRUCache.WithMaxAge(5000) //5 sec age
)
c.set("k1", "v1")
c.set("k2", "v2", 10000)
console.log(c.get("k2")); //v2
setTimeout(() => {  console.log(c.get("k2")); }, 2000); //v2
setTimeout(() => {  console.log(c.get("k1")); }, 7000); //-1 expired because 5 secs are over from the last access
setTimeout(() => {  console.log(c.get("k2")); }, 15000) //-1 expired because 10 secs are over from the last access
c.set("k3", "v3")
console.log(c.get("k3")); //v3
c.set("k3", "v3.1")
console.log(c.get("k3")); //v3.1
