"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUStorage = void 0;
var lru_1 = require("./../lru");
var fs = require("fs");
var flatted_1 = require("flatted");
//ref: https://nodejs.org/api/fs.html#file-system
var LRUStorage = /** @class */ (function () {
    function LRUStorage(path, cache) {
        this.filePath = path;
        if (!fs.existsSync(this.filePath)) {
            this.makeEmptyCache(cache);
        }
    }
    LRUStorage.prototype.clear = function () {
        var c1 = new lru_1.LRUCache();
        this.makeEmptyCache(c1);
    };
    LRUStorage.prototype.makeEmptyCache = function (cache) {
        try {
            fs.writeFileSync(this.filePath, (0, flatted_1.stringify)(cache));
        }
        catch (err) {
            console.error(err);
        }
    };
    LRUStorage.prototype.getCache = function () {
        return (0, flatted_1.parse)((fs.readFileSync(this.filePath)).toString());
    };
    LRUStorage.prototype.setCache = function (updatedCache) {
        try {
            fs.writeFileSync(this.filePath, (0, flatted_1.stringify)(updatedCache));
        }
        catch (err) {
            console.error(err);
        }
    };
    return LRUStorage;
}());
exports.LRUStorage = LRUStorage;
