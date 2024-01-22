import { Message } from "revolt.js";
import { exec } from "child_process";

import { handleError, setConfig, translate } from "../modules/functions.js";
import path from "path";
import { readdir, unlink } from "fs/promises";

export const name = "among";
export const aliases = ["sus"];
export const description = "sussy impostor commands :flushed:";
export const developer = true;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		switch (args[0]) {
			case "-p":
				await msg.channel?.sendMessage("pulling changes...");
				exec("git pull && yarn install"); // install new deps if they're specified
				break;
			case "-s": {
				if (!args[1]) {
					return msg.channel?.sendMessage(
						"what do you want me to say???"
					);
				}
				const message = args.slice(1).join(" ");
				return msg.channel?.sendMessage(message);
			}
			case "-ca": {
				msg.channel?.sendMessage("cleaning up archive files...");
				const __dirname = path.resolve();
				const folder = path.resolve(__dirname, "data/archives");
				const files = await readdir(folder);
				for (const file of files) {
					console.log(`${folder}/${file}`);
					await unlink(`${folder}/${file}`);
				}
				return msg.channel?.sendMessage(
					"cleaned up archive files :tada:"
				);
			}
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
					await setConfig(msg.author_id, args[1], args[2]);
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
			await translate(language, "errors.genericErrorWithTrace", {
				error: err,
			})
		);
		handleError(msg, err, "error");
	}
}
