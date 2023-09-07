import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError, translate } from "../modules/functions";

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
			await translate(language, "errors.genericErrorWithTrace", {
				error: err,
			})
		);
		handleError(msg, err, "error");
	}
}
