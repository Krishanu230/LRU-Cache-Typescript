"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCache = exports.LRUItem = void 0;
var LRUItem = /** @class */ (function () {
    function LRUItem() {
    }
    return LRUItem;
}());
exports.LRUItem = LRUItem;
//LRU Implementation using Double Linked List to maintian the usage order and a hashmap.
var LRUCache = /** @class */ (function () {
    //the constructor options input is inspired by: https://medium.com/swlh/using-a-golang-pattern-to-write-better-typescript-58044b56b26c
    function LRUCache() {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        // defaults
        this.MAX_ITEMS = Infinity;
        this.CUR_ITEMS = 0;
        this.MAX_AGE = 0;
        this.hashTable = new Map(); // choosing Map over native js object because of the object-based keys
        this.head = null;
        this.tail = null;
        //apply the options
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            option(this);
        }
    }
    LRUCache.WithMax = function (itemCount) {
        if (itemCount < 0) {
            throw new TypeError('Maximum number of items should be greater than or equal to zero');
        }
        return function (c) {
            c.MAX_ITEMS = itemCount;
        };
    };
    LRUCache.WithMaxAge = function (age) {
        if (age < 0) {
            throw new TypeError('Maximum age of items should be greater than or equal to zero');
        }
        return function (c) {
            c.MAX_AGE = age;
        };
    };
    LRUCache.prototype.reset = function () {
        this.MAX_ITEMS = Infinity;
        this.CUR_ITEMS = 0;
        this.MAX_AGE = 0;
        this.hashTable = new Map();
        this.head = null;
        this.tail = null;
    };
    LRUCache.prototype.set = function (key, value, age) {
        //this.dump()
        age = age || this.MAX_AGE;
        var now = Date.now();
        //if the key already exists
        if (this.hashTable[key]) {
            this.hashTable[key].value = value;
            this.hashTable[key].timeStamp = now;
            this.hashTable[key].maxAge = age;
            //update most recently used by calling get function
            this.base_get(key, false);
        }
        else {
            //creating a new node
            var node = {
                key: key,
                value: value,
                timeStamp: now,
                maxAge: age,
                prev: null,
                next: null
            };
            this.hashTable[key] = node;
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
            this.CUR_ITEMS += 1;
        }
        if (this.CUR_ITEMS > this.MAX_ITEMS) {
            this.deleteNode(this.tail.key);
        }
    };
    LRUCache.prototype.base_get = function (key, useStale) {
        if (this.hashTable[key]) {
            var now = Date.now();
            //useStale is to avoid the race condition where when this get is
            //called from the set function to update the timeStamp,
            //due to the delay the node expires.
            if (!useStale) {
                if (this.isStale(key)) {
                    this.deleteNode(key);
                    return -1;
                }
            }
            var node = this.hashTable[key];
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
        }
        else {
            return -1;
        }
    };
    //a wrapper around the private base_get function to avoid exposing use_Stale switch.
    LRUCache.prototype.get = function (key) {
        return this.base_get(key, false);
    };
    LRUCache.prototype.deleteNode = function (key) {
        if (this.hashTable[key]) {
            //let {value, timeStamp, maxAge, prev, next} = this.hashTable[key];
            var node = this.hashTable[key];
            if (node.prev) {
                node.prev.next = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            }
            if (this.head === this.hashTable[key]) {
                this.head = node.next;
            }
            if (this.tail === this.hashTable[key]) {
                this.tail = node.prev;
            }
            delete this.hashTable[key];
            this.CUR_ITEMS -= 1;
        }
        else {
            //nop
            return;
        }
    };
    LRUCache.prototype.isStale = function (key) {
        if (!this.hashTable[key]) {
            return true;
        }
        //const {value, timeStamp, maxAge, prev, next} = this.hashTable[key];
        var node = this.hashTable[key];
        if ((node.maxAge == 0) && (this.MAX_AGE == 0)) {
            return false;
        }
        var diff = Date.now() - node.timeStamp;
        if (node.maxAge) {
            //the local maxAge takes priorty over the global maxAge
            return diff > node.maxAge;
        }
        else {
            return diff > this.MAX_AGE;
        }
    };
    LRUCache.prototype.load = function (maxItems, curItems, maxAge, htable, head, tail) {
        this.reset();
        this.MAX_ITEMS = maxItems;
        this.CUR_ITEMS = curItems;
        this.MAX_AGE = maxAge;
        this.hashTable = new Map(Object.entries(htable));
        this.head = head;
        this.tail = tail;
    };
    LRUCache.prototype.dump = function () {
        console.log("MAX_ITEMS: " + this.MAX_ITEMS);
        console.log("CUR_ITEMS: " + this.CUR_ITEMS);
        console.log("MAX_AGE: " + this.MAX_AGE);
        console.log("head: " + this.head + " type: " + typeof this.head);
        console.log("tail: " + this.tail + " type: " + typeof this.tail);
        console.log("Map: ");
        console.log(this.hashTable);
    };
    return LRUCache;
}());
exports.LRUCache = LRUCache;
