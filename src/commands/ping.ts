import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError, translate } from "../modules/functions.js";

import path from "path";

import git from "git-rev-sync";

export const name = "ping";
export const aliases = ["pong"];
export const description = globalStrings.ping.description;
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const botMsg = await msg.channel?.sendMessage(
			await translate(language, "ping.pong")
		);
		const description = `${await translate(
			language,
			"ping.embedDescription",
			{
				time: botMsg!.createdAt - msg.createdAt,
				host: process.env.HOST,
				commit: git.short(path.resolve()),
			}
		)}`;

		botMsg?.edit({
			content: " ",
			embeds: [
				{
					title: await translate(language, "ping.pong"),
					description: description,
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
