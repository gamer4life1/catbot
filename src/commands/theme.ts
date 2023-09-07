import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import {
	handleError,
	sleep,
	translate,
	uploadFile,
} from "../modules/functions";

// node builtins
import { writeFile, readFile, unlink } from "fs/promises";

import path from "path";

// external libs
import { stringify } from "@iarna/toml";

export const name = "theme";
export const aliases = ["converttheme"];
export const description = globalStrings.theme.description;
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const botMsg = await msg.channel?.sendMessage(
			globalStrings.theme.converting
		);
		const params = args.join(" ").split("|");
		const rawObj = JSON.parse(params[0]);
		const obj = {
			name: params[1].trimStart().trimEnd(),
			slug: params[2].trimStart().trimEnd(),
			author: params[3].trimStart().trimEnd(),
			version: params[4].trimStart().trimEnd(),
			variables: {
				light: rawObj.light,
				accent: rawObj.accent,
				background: rawObj.background,
				foreground: rawObj.foreground,
				block: rawObj.block,
				"message-box": rawObj["message-box"],
				mention: rawObj.mention,
				success: rawObj.success,
				warning: rawObj.warning,
				error: rawObj.error,
				hover: rawObj.hover,
				tooltip: rawObj.tooltip,
				scrollbar: {
					track: rawObj["scrollbar-track"],
					thumb: rawObj["scrollbar-thumb"],
				},
				primary: {
					header: rawObj["primary-header"],
					background: rawObj["primary-background"],
					foreground: rawObj["primary-foreground"],
				},
				secondary: {
					header: rawObj["secondary-header"],
					background: rawObj["secondary-background"],
					foreground: rawObj["secondary-foreground"],
				},
				tertiary: {
					background: rawObj["tertiary-background"],
					foreground: rawObj["tertiary-foreground"],
				},
				status: {
					online: rawObj["status-online"],
					away: rawObj["status-away"],
					focus: rawObj["status-focus"],
					busy: rawObj["status-busy"],
					streaming: rawObj["status-streaming"],
					invisible: rawObj["status-invisible"],
				},
			},
		};
		const toml = stringify(obj);

		botMsg?.edit({
			content: globalStrings.theme.preparingFile,
		});
		// define filenames
		const filename = `${msg._id}_Preset.toml`;
		const dir = `data/themes/${filename}`;

		const __dirname = path.resolve();
		const resolvedDir = path.resolve(__dirname, `${dir}`);

		// create file
		await writeFile(dir, toml);
		botMsg?.edit({
			content: await translate(language, "theme.themeReady", {
				filename: filename,
			}),
		});

		const archiveBuffer = await readFile(resolvedDir);
		const attachment = await uploadFile(
			msg.client,
			archiveBuffer,
			filename
		);
		msg.channel?.sendMessage({
			content: " ",
			attachments: [attachment],
		});

		// wait 30 minutes before deleting file
		await sleep(1800000);

		await unlink(dir);
	} catch (err) {
		msg.channel?.sendMessage(
			await translate(language, "errors.genericErrorWithTrace", {
				error: err,
			})
		);
		handleError(msg, err, "error");
	}
}
