# Run Aerodrome on a benchmark
### Dependencies
1.  flatted
	`npm i flatted`
2. fs
	`npm install fs`
##### To RUN:
3. ts-node
`npm install -g ts-node`
4. tsc
`npm install typescript -g`
5. npx
 `npm install -g npx`

### Run
1. Compile lru-disk.ts
`tsc lru-disk.ts --lib "es6" -t es5`
2. Compile storage/lru-storage.ts
`tsc storage/lru-storage.ts --lib "es6" `
3. Compile lru-disk.ts
`tsc lru-disk.ts --lib "es6" -t es5 `
4. Now run any file that uses the cache by:
 ` npx ts-node exampleDisk.ts `
## About
A simple LRU cache based on Double linked list and HashMap. It has two versions:
1. In-Memory: LRUCache
2. On-Disk: LRUCacheDisk: This is not completely working, refer to note point 2
## Notes
1. I first tried to store the files using the async promises version of fs package but it did not work out well because of too many callbacks/thens to chainify the calls. I switched to sync/blocking version of the fs to store files. Though the async version has been recorded in the commit history.
2.  There is an issue with the serialization of the data. I am using double linked list which has circular references which I realized much later can not be serialized using the json stringfy. There were a few alternatives available but I could not make them work due to the limitation of the time. As a result due to the serialization issue, the LRUCacheDisk version does not work. This is not a major issue technically and can be resolved with more efforts easily.  There are two ways forward, Either i make the cache without the double linked list data structure or store it using something like object store not json serial data. Both of them required time. This is a to-do agenda.
## Code Structure
1. lru.ts: This file contains the in-memory lru cache implementation.
2. storage/storage.ts: Defines the Storage interface so that the underlying storage implementation can be abstracted away with different possible versions of implementation such as object store based storage, filesys storage etc
3. lru-storage.ts: this defines the fs implementation of the storage interface. This is unstable right now, please see notes. This file saves and and retrieves the cache object from disk. There is an issue with the serialization refer to the notes.
4. lru-disk.ts: This the on-disk version of the cache. Every set and get retrieves the cache object from and to the disk and updates it.  Note that this does not work beyond storing one key value pair as the double linked list gets circular after one node. Refer to the point 2 in notes.
Most of my references are taken from the following sources:
1. Constructor ref: https://medium.com/swlh/using-a-golang-pattern-to-write-better-typescript-58044b56b26c
2. circular reference parse: https://github.com/WebReflection/flatted#flatted
3. circular issue: https://stackoverflow.com/questions/27101240/typeerror-converting-circular-structure-to-json-in-nodejs
## Options
### LRUCache
1. `MAX_ITEMS`: The maximum number of items the cache can hold. Default value is Infinity.
2. `MAX_AGE`: The maximum age of items in micro-seconds. If set, this value or the key's individual maxAge will govern the time before the item expires. If the item is expired it would be as if the item was deleted. The item will be refreshed with every set and get access. If MAX_AGE is not set and the keys individual maxAge has not been set then it would work without any expiry.
### LRUItem
1.  `key`: key can be of any type.
2. `value`: value can be of any type.
3. `maxAge`: This is the per key Max Age in micro-seconds and can be set differently for different keys. This will take priority over the global MAX_AGE of the cache. If MAX_AGE is not set and the keys individual maxAge has not been set then it would work without any expiry.

## API
1.  `LRUCache(LRUCache.WithMax(number),LRUCache.WithMaxAge(number)) returns LRUCache` Both of the options are optional and the order in which they are passed does not matter.
2.  `LRUCache.set(key, value, maxAge?)` The maxAge is optional.
3.   `LRUCache.get(key)` -1 if key not found
4. `LRUCache.reset()` Resets the Cache to default values of every parameter and an empty Hashmap.  
5. `LRUCache.dump()` Prints the Cache.
6. `LRUStorage.getCache()` Gets the Cache from disk.
7. `LRUStorage.setCache(LRUCache object)` Sets the Cache object from disk.
8. `LRUCacheDisk(JsonFilePath, LRUCache.WithMax(number),LRUCache.WithMaxAge(number)) returns LRUCacheDisk ` Both of the LRUCache options are optional and note that the order in which LRUCache options are passed does not matter but the path should the first parameter.
9.  `LRUCacheDisk.get_disk(key)`-1 if key not found
10.  `LRUCacheDisk.set_disk(key, value, age?)` The maxAge is optional.

## Example

```
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
```
### TO-DO
1. Optimise the map futher with functions like prune to remove stale stuff periodically.
2. FIx the Serialization issue.
