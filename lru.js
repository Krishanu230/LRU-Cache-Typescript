"use strict";
exports.__esModule = true;
exports.LRUCache = void 0;
var LRUCache = /** @class */ (function () {
    function LRUCache() {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        // defaults
        this.MAX_ITEMS = Infinity;
        this.CUR_ITEMS = 0;
        this.MAX_AGE = 0;
        this.hashTable = new Map(); // choosing this over native js object because of the object-based keys
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
    LRUCache.prototype.set = function (key, value, age) {
        age = age || this.MAX_AGE;
        var now = this.MAX_AGE ? Date.now() : 0;
        //if the key already exists
        if (this.hashTable[key]) {
            this.hashTable[key].value = value;
            this.hashTable[key].timeStamp = now;
            this.hashTable[key].maxAge = age;
            //update most recently used by calling get function
            this.get(key);
        }
        else {
            //creating a new node
            this.hashTable[key] = {
                key: key,
                value: value,
                timeStamp: now,
                maxAge: age,
                prev: null,
                next: null
            };
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
    LRUCache.prototype.get = function (key) {
        if (this.hashTable[key]) {
            var _a = this.hashTable[key], value = _a.value, timeStamp = _a.timeStamp, maxAge = _a.maxAge, prev = _a.prev, next = _a.next;
            /*if isStale(this.hashTable[key]){

            }*/
            //get ready to move this node to head
            if (prev) {
                prev.next = next;
            }
            if (next) {
                next.prev = prev;
            }
            //if the get value was the next to be removed
            if (this.tail === this.hashTable[key]) {
                this.tail = prev || this.hashTable[key];
            }
            //redefine prev
            this.hashTable[key].prev = null;
            if (this.head !== this.hashTable[key]) {
                this.hashTable[key].next = this.head;
                this.head.prev = this.hashTable[key];
            }
            //redefine head
            this.head = this.hashTable[key];
            return value;
        }
        return -1;
    };
    LRUCache.prototype.deleteNode = function (key) {
        if (this.hashTable[key]) {
            var _a = this.hashTable[key], value = _a.value, timeStamp = _a.timeStamp, maxAge = _a.maxAge, prev = _a.prev, next = _a.next;
            if (prev) {
                prev.next = next;
            }
            if (next) {
                next.prev = prev;
            }
            if (this.head === this.hashTable[key]) {
                this.head = next;
            }
            if (this.tail === this.hashTable[key]) {
                this.tail = prev;
            }
            delete this.hashTable[key];
            this.CUR_ITEMS -= 1;
        }
        else {
            //nop
            return;
        }
    };
    LRUCache.prototype.dump = function () {
        console.log("----------");
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
