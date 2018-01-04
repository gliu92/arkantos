#!/usr/bin/env node
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var GTT = require("gdax-trading-toolkit");
var Tracker_1 = require("./Tracker");
// Bitfinex Imports
var BitfinexExchangeAPI_1 = require("gdax-trading-toolkit/build/src/exchanges/bitfinex/BitfinexExchangeAPI");
var bitfinexFactories_1 = require("gdax-trading-toolkit/build/src/factories/bitfinexFactories");
var printOrderbook = GTT.utils.printOrderbook;
var printTicker = GTT.utils.printTicker;
var BitfinexTracker = /** @class */ (function (_super) {
    __extends(BitfinexTracker, _super);
    function BitfinexTracker(config) {
        var _this = _super.call(this) || this;
        _this.api = new BitfinexExchangeAPI_1.BitfinexExchangeAPI(config);
        return _this;
    }
    BitfinexTracker.prototype.logLevel = function () {
        var _this = this;
        bitfinexFactories_1.FeedFactory(this.logger, [this.product])
            .then(function (feed) {
            feed.on("data", function (msg) {
                if (msg.type == "level") {
                    // this.printLevel(msg);
                }
            });
        })["catch"](function (err) {
            _this.logger.log("error", err.message);
            process.exit(1);
        });
    };
    BitfinexTracker.prototype.logOrderbook = function () {
        var _this = this;
        bitfinexFactories_1.FeedFactory(this.logger, [this.product])
            .then(function (feed) {
            _this.book.on("LiveOrderbook.snapshot", function () {
                setInterval(function () {
                    console.log(printOrderbook(_this.book, 10));
                    _this.logger.log("info", "Cumulative trade volume: " + _this.tradeVolume.toFixed(4));
                }, 500);
            });
            _this.book.on("LiveOrderbook.trade", function (trade) {
                _this.tradeVolume += +trade.size;
            });
            _this.book.on("LiveOrderbook.skippedMessage", function (details) {
                // On GDAX, this event should never be emitted, but we put it here for completeness
                console.log("SKIPPED MESSAGE", details);
                console.log("Reconnecting to feed");
                feed.reconnect(0);
            });
            feed.pipe(_this.book);
        })["catch"](function (err) {
            _this.logger.log("error", err.message);
            process.exit(1);
        });
    };
    BitfinexTracker.prototype.logTicker = function () {
        var _this = this;
        bitfinexFactories_1.FeedFactory(this.logger, [this.product])
            .then(function (feed) {
            _this.book.on("LiveOrderbook.ticker", function (ticker) {
                console.log(printTicker(ticker));
            });
            _this.book.on("LiveOrderbook.skippedMessage", function (details) {
                // On GDAX, this event should never be emitted, but we put it here for completeness
                console.log("SKIPPED MESSAGE", details);
                console.log("Reconnecting to feed");
                feed.reconnect(0);
            });
            _this.book.on("end", function () {
                console.log("Orderbook closed");
            });
            feed.pipe(_this.book);
        })["catch"](function (err) {
            _this.logger.log("error", err.message);
            process.exit(1);
        });
    };
    return BitfinexTracker;
}(Tracker_1.Tracker));
exports.BitfinexTracker = BitfinexTracker;
