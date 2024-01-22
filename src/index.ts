import "./env.js";

import { Client } from "revolt.js";
import { config } from "./config.js";
import { BotFramework } from "./modules/framework.js";

class RexBot extends Client {
	framework: BotFramework;

	constructor() {
		super({ apiURL: process.env.API_URL ?? "https://api.revolt.chat" });
		this.framework = new BotFramework(this, config.prefix);
	}
}

const rexbotClient = new RexBot();

try {
	rexbotClient.loginBot(process.env.TOKEN!);
} catch (err) {
	console.log("Failed to log in!");
}
