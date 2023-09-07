import { RBMessage } from "../types/client.js";

import { globalStrings } from "../i18n/en_GB.js";

import { Command } from "../types/command.js";
import { config } from "../config.js";
import {
	getCommand,
	getUserConfig,
	handleError,
	translate,
} from "../modules/functions.js";

export const name = "help";
export const aliases = ["h"];
export const description =
	"Returns a list of the bot's commands or, if a command is specified, info about the command.";
export const usage = "help [command]";
export const developer = false;
export const serverOnly = false;

export async function run(msg: RBMessage, language: string, args: string[]) {
	try {
		const input = args.join(" ");
		const userConfig = await getUserConfig(msg.author?._id!);
		const authorIsDev = userConfig?.developer || false;
		const title = `${msg.client.user?.username} Help\n`;
		let content = "";
		let colour = "var(--accent)";
		if (!input) {
			for (const cmd of msg.client.framework.commands) {
				if (cmd.developer && !authorIsDev) continue;
				content += `**${cmd.name}**\n${
					cmd.description || "No description."
				}\n\n`;
			}
			content +=
				"*You can view the bot's privacy policy by running rex!privacy.*";
		} else {
			const cmd: Command = getCommand(input, msg.client.framework);
			if (!cmd) {
				colour = "var(--error)";
				content =
					"**Command not found**\nThat doesn't seem to be a command - have you spelt the command's name correctly?";
			} else {
				content +=
					`**${cmd.name}**\n${
						cmd.description || "No description."
					}\n\n` +
					`**Usage**\n\`${config.prefix}${
						cmd.usage || cmd.name
					}\`\n\n` +
					`**Aliases**\n\`${cmd.aliases.join("`, `")}\``;
			}
		}
		msg.channel?.sendMessage({
			content: " ",
			embeds: [{ title, description: content, colour }],
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
