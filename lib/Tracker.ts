#!/usr/bin/env node

import * as GTT from "gdax-trading-toolkit";

// Common Imports
import {
    LiveBookConfig,
    LiveOrderbook,
    OrderbookMessage,
    SkippedMessageEvent
} from "gdax-trading-toolkit/build/src/core";
import { PublicExchangeAPI } from "gdax-trading-toolkit/build/src/exchanges/PublicExchangeAPI";

export abstract class Tracker {
    api: PublicExchangeAPI;
    logger: GTT.utils.Logger;
    book: LiveOrderbook;
    product: string;
    tradeVolume: number;

    constructor() {
        this.product = "ETH-USD";
        this.logger = GTT.utils.ConsoleLoggerFactory({ level: "info" });

        const orderBookConfig: LiveBookConfig = {
            product: this.product,
            logger: this.logger
        };
        this.book = new LiveOrderbook(orderBookConfig);

        this.tradeVolume = 0;
    }

    logProducts() {
        this.api.loadProducts().then(products => {
            this.logger.log(
                "info",
                "Products for " + this.api.owner,
                products.map(p => p.id).join(" ")
            );
        });
    }

    abstract logLevel(): void;

    abstract logOrderbook(): void;

    abstract logTicker(): void;
}
