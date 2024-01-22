import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError, translate } from "../modules/functions.js";

export const name = "config";
export const aliases = ["conf", "settings"];
export const description = "[WIP] View, edit or clear your saved config.";
export const developer = true;
export const serverOnly = false;

export async function run(msg: Message, language: string) {
	try {
		const botMsg = await msg.channel?.sendMessage(
			await translate(language, "ping.pong")
		);
		botMsg?.edit({
			content: " ",
			embeds: [
				{
					title: await translate(language, "ping.pong"),
					description: `${await translate(
						language,
						"ping.embedDescription",
						{ time: botMsg.createdAt - msg.createdAt }
					)}`,
					colour: globalStrings.embeds.accent,
				},
			],
		});
	} catch (err) {
		msg.channel?.sendMessage(
			await translate(language, "errors.genericErrorWithTrace", {
				error: err,
			})
		);
		handleError(msg, err, "error");
	}
}
