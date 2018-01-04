#!/usr/bin/env node

import * as GTT from "gdax-trading-toolkit";

import { Tracker } from "./Tracker";
import {
	OrderbookMessage,
	SkippedMessageEvent,
	TradeMessage
} from "gdax-trading-toolkit/build/src/core";
import { Ticker } from "gdax-trading-toolkit/build/src/exchanges/PublicExchangeAPI";

// Bitfinex Imports
import {
	BitfinexConfig,
	BitfinexExchangeAPI
} from "gdax-trading-toolkit/build/src/exchanges/bitfinex/BitfinexExchangeAPI";
import {
	BitfinexFeed,
	BitfinexFeedConfig
} from "gdax-trading-toolkit/build/src/exchanges/bitfinex/BitfinexFeed";
import { FeedFactory as BitfinexFeedFactory } from "gdax-trading-toolkit/build/src/factories/bitfinexFactories";

const printOrderbook = GTT.utils.printOrderbook;
const printTicker = GTT.utils.printTicker;

export class BitfinexTracker extends Tracker {
	constructor(config: BitfinexConfig) {
		super();
		this.api = new BitfinexExchangeAPI(config);
	}

	logLevel(): void {
		BitfinexFeedFactory(this.logger, [this.product])
			.then((feed: BitfinexFeed) => {
				feed.on("data", (msg: OrderbookMessage) => {
					if (msg.type == "level") {
						// this.printLevel(msg);
					}
				});
			})
			.catch((err: Error) => {
				this.logger.log("error", err.message);
				process.exit(1);
			});
	}

	logOrderbook(): void {
		BitfinexFeedFactory(this.logger, [this.product])
			.then((feed: BitfinexFeed) => {
				this.book.on("LiveOrderbook.snapshot", () => {
					setInterval(() => {
						console.log(printOrderbook(this.book, 10));
						this.logger.log(
							"info",
							`Cumulative trade volume: ${this.tradeVolume.toFixed(
								4
							)}`
						);
					}, 500);
				});
				this.book.on("LiveOrderbook.trade", (trade: TradeMessage) => {
					this.tradeVolume += +trade.size;
				});
				this.book.on(
					"LiveOrderbook.skippedMessage",
					(details: SkippedMessageEvent) => {
						// On GDAX, this event should never be emitted, but we put it here for completeness
						console.log("SKIPPED MESSAGE", details);
						console.log("Reconnecting to feed");
						feed.reconnect(0);
					}
				);
				feed.pipe(this.book);
			})
			.catch((err: Error) => {
				this.logger.log("error", err.message);
				process.exit(1);
			});
	}

	logTicker(): void {
		BitfinexFeedFactory(this.logger, [this.product])
			.then((feed: BitfinexFeed) => {
				this.book.on("LiveOrderbook.ticker", (ticker: Ticker) => {
					console.log(printTicker(ticker));
				});
				this.book.on(
					"LiveOrderbook.skippedMessage",
					(details: SkippedMessageEvent) => {
						// On GDAX, this event should never be emitted, but we put it here for completeness
						console.log("SKIPPED MESSAGE", details);
						console.log("Reconnecting to feed");
						feed.reconnect(0);
					}
				);
				this.book.on("end", () => {
					console.log("Orderbook closed");
				});
				feed.pipe(this.book);
			})
			.catch((err: Error) => {
				this.logger.log("error", err.message);
				process.exit(1);
			});
	}
}
