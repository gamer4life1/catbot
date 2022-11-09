import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { getLanguage, handleError } from "../modules/functions.js";

export const name = "config";
export const aliases = ["conf", "settings"];
export const description = "[WIP] View, edit or clear your saved config.";
export const developer = true;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const localStrings =
			language !== "en_GB" ? await getLanguage(msg.author?._id!) : null;
		const botMsg = await msg.channel?.sendMessage(
			(localStrings ?? globalStrings).ping.pong
		);
		botMsg?.edit({
			content: " ",
			embeds: [
				{
					title: (localStrings ?? globalStrings).ping.pong,
					description: (
						localStrings?.ping.embedDescription ??
						globalStrings.ping.embedDescription
					)(botMsg.createdAt - msg.createdAt),
					colour: globalStrings.embeds.accent,
				},
			],
		});
		// todo: test reaction menus
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
		handleError(msg, err, "error");
	}
}
