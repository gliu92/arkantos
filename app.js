#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var program = require("commander");
var GTT = require("gdax-trading-toolkit");
// Bitfinex Imports
var BitfinexTracker_1 = require("./lib/BitfinexTracker");
var CONFIG = require("/config.json");
var logger = GTT.utils.ConsoleLoggerFactory({ level: "info" });
var bitfinexConfig = {
    logger: logger,
    auth: {
        key: CONFIG.BITFINEX_KEY,
        secret: CONFIG.BITFINEX_SECRET
    }
};
var tracker = new BitfinexTracker_1.BitfinexTracker(bitfinexConfig);
program
    .version("1.0.0")
    .description("Arkantos trading bot across popular exchanges");
program
    .command("list")
    .description("List products available on the exchange")
    .action(function () { return tracker.logProducts(); });
program
    .command("book")
    .description("Log orderbook stats to console")
    .action(function () { return tracker.logOrderbook(); });
program
    .command("level")
    .description("Log level changes to console")
    .action(function () { return tracker.logProducts(); });
program
    .command("ticker")
    .description("Log ticker changes to console")
    .action(function () { return tracker.logTicker(); });
program.parse(process.argv);
process.on("SIGINT", function () {
    process.exit(0);
});
