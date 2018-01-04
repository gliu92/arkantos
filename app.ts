#!/usr/bin/env node

import * as program from "commander";
import * as input from "inquirer";
import * as GTT from "gdax-trading-toolkit";

// Bitfinex Imports
import { BitfinexTracker } from "./src/BitfinexTracker";
import { BitfinexConfig } from "gdax-trading-toolkit/build/src/exchanges/bitfinex/BitfinexExchangeAPI";

const CONFIG = require("/config.json");
const logger = GTT.utils.ConsoleLoggerFactory({ level: "info" });

const bitfinexConfig: BitfinexConfig = {
    logger: logger,
    auth: {
        key: CONFIG.BITFINEX_KEY,
        secret: CONFIG.BITFINEX_SECRET
    }
};

const tracker = new BitfinexTracker(bitfinexConfig);

program
    .version("1.0.0")
    .description("Arkantos trading bot across popular exchanges");

program
    .command("list")
    .description("List products available on the exchange")
    .action(() => tracker.logProducts());

program
    .command("book")
    .description("Log orderbook stats to console")
    .action(() => tracker.logOrderbook());

program
    .command("level")
    .description("Log level changes to console")
    .action(() => tracker.logProducts());

program
    .command("ticker")
    .description("Log ticker changes to console")
    .action(() => tracker.logTicker());

program.parse(process.argv);

process.on("SIGINT", () => {
    process.exit(0);
});
