import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

export const name = "shutdown";
export const aliases = ["sd"];
export const description = "Shuts down the bot.";
export const developer = true;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		await msg.channel?.sendMessage(globalStrings.shutdown.response);
		process.exit();
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
	}
}
