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

// external
import { archiveChannel } from "revchiver";

export const name = "archive";
export const aliases = [];
export const description = globalStrings.archive.description;
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string) {
	try {
		const botMsg = await msg.channel?.sendMessage(
			globalStrings.archive.fetchingInfo
		);
		const archiveData = await archiveChannel(msg, [botMsg!]);

		// create file
		await botMsg?.edit({ content: globalStrings.archive.creatingFile });
		const rawjson = JSON.stringify(archiveData, null, 4);

		// remove empty pair of curly brackets ({})
		// eslint-disable-next-line no-control-regex
		const regex = new RegExp(" {7}{},\n");
		const json = rawjson.replace(regex, "");

		// define filenames
		const filename = `archive_${msg.channel_id}_${msg.createdAt}.json`;
		const dir = `data/archives/${filename}`;

		const __dirname = path.resolve();
		const resolvedDir = path.resolve(__dirname, `${dir}`);

		// create file
		await writeFile(dir, json);
		botMsg?.edit({
			content: await translate(language, "archive.archiveComplete", {
				id: msg.channel_id,
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
