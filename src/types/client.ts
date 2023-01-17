import { Client, Message } from "revolt.js";

import { BotFramework } from "../modules/framework";

export type RBClient = Client & {
	framework: BotFramework;
};

export type RBMessage = Message & {
	client: RBClient;
};
