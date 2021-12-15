export type LRUCacheOption = (l: LRUCache) => void

export class LRUItem {
  public key;
  public value;
  public timeStamp: number;
  public maxAge: number;
  public prev;
  public next;
}

export class LRUCache {
  private MAX_ITEMS: number;
  private CUR_ITEMS: number;
  private MAX_AGE: number;
  private hashTable: Map<any, LRUItem>;
  private head;
  private tail;

  constructor (...options: LRUCacheOption[]) {
    // defaults
    this.MAX_ITEMS = Infinity;
    this.CUR_ITEMS = 0;
    this.MAX_AGE = 0;
    this.hashTable = new Map<any, LRUItem>() // choosing Map over native js object because of the object-based keys
    this.head = null;
    this.tail = null;

    //apply the options
    for (const option of options) {
     option(this)
    }
  }

  public static WithMax(itemCount: number): LRUCacheOption {
    if (itemCount < 0){
      throw new TypeError('Maximum number of items should be greater than or equal to zero')
    }
    return (c: LRUCache): void => {
      c.MAX_ITEMS = itemCount
    }
  }

  public static WithMaxAge(age: number): LRUCacheOption {
    if (age < 0){
      throw new TypeError('Maximum age of items should be greater than or equal to zero')
    }
    return (c: LRUCache): void => {
      c.MAX_AGE = age
    }
  }

  public reset(){
    this.MAX_ITEMS = Infinity;
    this.CUR_ITEMS = 0;
    this.MAX_AGE = 0;
    this.hashTable.clear()
    this.head = null;
    this.tail = null;
  }

  public set(key, value, age?:number){
    //this.dump()
    age = age || this.MAX_AGE
    const now = Date.now()

    //if the key already exists
    if(this.hashTable[key]){
      this.hashTable[key].value = value;
      this.hashTable[key].timeStamp = now;
      this.hashTable[key].maxAge = age;
      //update most recently used by calling get function
      this.base_get(key, false);
    }else{
      //creating a new node
      let node: LRUItem = {
        key: key,
        value: value,
        timeStamp: now,
        maxAge: age,
        prev: null,
        next: null
      }
      this.hashTable[key] = node
      //if head exists, update the pointers
      if (this.head) {
         this.hashTable[key].next = this.head;
         this.head.prev = this.hashTable[key];
      }
      this.head = this.hashTable[key];

      //if no tail, make new head tail
      if (!this.tail) {
        this.tail = this.hashTable[key];
      }

      this.CUR_ITEMS += 1
    }

    if (this.CUR_ITEMS > this.MAX_ITEMS){
      this.deleteNode(this.tail.key)
    }
  }

  private base_get(key, useStale:boolean){
    if (this.hashTable[key]) {
            const now = Date.now()
            //useStale is to avoid the race condition where when this get is
            //called from the set function to update the timeStamp,
            //due to the delay the node expires.
            if (!useStale){
              if (this.isStale(key)){
                this.deleteNode(key);
                return -1;
              }
            }
            const node: LRUItem = this.hashTable[key]
            //const {value, timeStamp, maxAge, prev, next} = this.hashTable[key];
            this.hashTable[key].timeStamp = now;

            //get ready to move this node to head
            if (node.prev) {
                node.prev.next = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            }
            //if the get value was the next to be removed
            if (this.tail === this.hashTable[key]) {
                this.tail = node.prev || this.hashTable[key];
            }

            //redefine prev
            this.hashTable[key].prev = null;

            if (this.head !== this.hashTable[key]) {
                this.hashTable[key].next = this.head;
                this.head.prev = this.hashTable[key];
            }
            //redefine head
            this.head = this.hashTable[key];
            return node.value;
        }else{
            return -1;
        }
  }

  //a wrapper around the private base_get function to avoid exposing use_Stale switch.
  public get(key){
    //this.dump()
    return this.base_get(key, false)
  }

  private deleteNode(key){
    if(this.hashTable[key]){
      //let {value, timeStamp, maxAge, prev, next} = this.hashTable[key];
      const node: LRUItem = this.hashTable[key]
      if (node.prev) {
          node.prev.next = node.next;
      }
      if (node.next) {
          node.next.prev = node.prev;
      }
      if (this.head === this.hashTable[key]){
        this.head = node.next
      }
      if (this.tail === this.hashTable[key]){
        this.tail = node.prev
      }
      delete this.hashTable[key]
      this.CUR_ITEMS -= 1
    }else{
      //nop
      return
    }
  }

  private isStale(key){
    if (!this.hashTable[key]){
      return true
    }
    //const {value, timeStamp, maxAge, prev, next} = this.hashTable[key];
    const node: LRUItem = this.hashTable[key]

    if ((node.maxAge == 0) && (this.MAX_AGE == 0)){
        return true
    }

    const diff = Date.now() - node.timeStamp
    if (node.maxAge){
      //the local maxAge takes priorty over the global maxAge
      return diff > node.maxAge
    }else{
      return diff > this.MAX_AGE
    }
  }

  public load(maxItems:number, curItems:number, maxAge:number, htable, head, tail){
    this.reset()
    this.MAX_ITEMS = maxItems
    this.CUR_ITEMS = curItems
    this.MAX_AGE = maxAge
    this.hashTable = new Map(Object.entries(htable));
    this.head = head
    this.tail = tail
  }

  public dump(){
    console.log("----------")
    console.log("MAX_ITEMS: "+ this.MAX_ITEMS)
    console.log("CUR_ITEMS: "+ this.CUR_ITEMS)
    console.log("MAX_AGE: "+ this.MAX_AGE)
    console.log("head: "+ this.head+" type: "+ typeof this.head)
    console.log("tail: "+ this.tail+" type: "+ typeof this.tail)
    console.log("Map: ");
    console.log(this.hashTable)
  }
}
