import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { getLanguage, handleError } from "../modules/functions.js";

import path from "path";

import git from "git-rev-sync";

export const name = "ping";
export const aliases = ["pong"];
export const description = globalStrings.ping.description;
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const localStrings =
			language !== "en_GB" ? await getLanguage(msg.author?._id!) : null;
		const botMsg = await msg.channel?.sendMessage(
			localStrings?.ping.pong ?? globalStrings.ping.pong
		);
		botMsg?.edit({
			content: " ",
			embeds: [
				{
					title: localStrings?.ping.pong ?? globalStrings.ping.pong,
					description: `${(
						localStrings?.ping.embedDescription ??
						globalStrings.ping.embedDescription
					)(
						botMsg.createdAt - msg.createdAt
					)}\n\n**Extra info**\nHost: \`${
						process.env.HOST
					}\`\nGit commit: \`${git.short(path.resolve())}\``,
					colour: globalStrings.embeds.accent,
				},
			],
		});
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
		handleError(msg, err, "error");
	}
}
