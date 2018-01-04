#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var GTT = require("gdax-trading-toolkit");
// Common Imports
var core_1 = require("gdax-trading-toolkit/build/src/core");
var Tracker = /** @class */ (function () {
    function Tracker() {
        this.product = "ETH-USD";
        this.logger = GTT.utils.ConsoleLoggerFactory({ level: "info" });
        var orderBookConfig = {
            product: this.product,
            logger: this.logger
        };
        this.book = new core_1.LiveOrderbook(orderBookConfig);
        this.tradeVolume = 0;
    }
    Tracker.prototype.logProducts = function () {
        var _this = this;
        this.api.loadProducts().then(function (products) {
            _this.logger.log("info", "Products for " + _this.api.owner, products.map(function (p) { return p.id; }).join(" "));
        });
    };
    return Tracker;
}());
exports.Tracker = Tracker;
