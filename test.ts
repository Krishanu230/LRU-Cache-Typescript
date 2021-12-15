import {LRUCache} from './lru'
import {LRUCacheDisk} from './lru-disk'
var c = new LRUCache(
  LRUCache.WithMax(3),
  LRUCache.WithMaxAge(5001)
)

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

c.set("k2", "v2")
console.log(c.get("k2"));
c.dump()
//setTimeout(() => {  console.log(c.get("k2")); }, 2000);
//setTimeout(() => {  console.log(c.get("k2")); }, 11000);

var c2 = new LRUCacheDisk(
  "test.json",
  LRUCache.WithMax(3),
  LRUCache.WithMaxAge(5001),
)
async function waittillset(){
  await c2.set_disk("k2", "v2")
  console.log("------after wait------");
}
console.log("------------");
waittillset()
console.log("------now read------");
//let k2 = c2.get_disk("k2").catch(e => { console.log(e) })
/*let k1 = c2.get_disk("k1").catch(e => { console.log(e) })
k1.then(function(result) {
   console.log(result)
})

k2.then(function(result) {
   console.log(result)
})*/
