"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCacheDisk = void 0;
var lru_1 = require("./lru");
var lru_storage_1 = require("./storage/lru-storage");
var LRUCacheDisk = /** @class */ (function () {
    function LRUCacheDisk(path) {
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        this.lruMem = new (lru_1.LRUCache.bind.apply(lru_1.LRUCache, __spreadArray([void 0], options, false)))();
        this.storage = new lru_storage_1.LRUStorage(path, this.lruMem);
    }
    LRUCacheDisk.prototype.set_disk = function (key, value, age) {
        var raw = this.storage.getCache();
        this.lruMem.load(raw.MAX_ITEMS, raw.CUR_ITEMS, raw.MAX_AGE, raw.hashTable, raw.head, raw.tail);
        this.lruMem.set(key, value, age);
        this.storage.setCache(this.lruMem);
    };
    LRUCacheDisk.prototype.get_disk = function (key) {
        var raw = this.storage.getCache();
        return this.lruMem.get(key);
    };
    return LRUCacheDisk;
}());
exports.LRUCacheDisk = LRUCacheDisk;
