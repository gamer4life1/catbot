import { Message } from "revolt.js";
import { exec } from "child_process";

import { globalStrings } from "../i18n/en_GB";

import { getLanguage, setConfig } from "../modules/functions.js";

export const name = "among";
export const aliases = ["sus"];
export const description = globalStrings.ping.description;
export const developer = true;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const localStrings =
			language !== "en_GB" ? await getLanguage(msg.author?._id!) : null;
		switch (args[0]) {
			case "-p":
				await msg.channel?.sendMessage("pulling changes...");
				exec("git pull");
			case "-s":
				if (!args[1]) {
					return msg.channel?.sendMessage(
						"what do you want me to say???"
					);
				}
				const message = args.slice(1).join(" ");
				return msg.channel?.sendMessage(message);
				break;
			case "-c":
				if (!args[1]) {
					return msg.channel?.sendMessage(
						"which key do you want to change, and what do you want to set it to?"
					);
				}
				if (!args[2]) {
					return msg.channel?.sendMessage(
						"what do you want to set it to?"
					);
				}
				try {
					await setConfig(msg.author?._id!, args[1], args[2]);
					return msg.channel?.sendMessage(
						`\`${args[1]}\` has been set to \`${args[2]}\``
					);
				} catch (err) {
					return msg.channel?.sendMessage(`uhhhh oops\n\n${err}`);
				}
			default:
				return msg.channel?.sendMessage(
					"specify a subcommand you sussy baka"
				);
				break;
		}
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
	}
}
