import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError } from "../modules/functions";

// node builtins
import { writeFile, readFile, unlink } from "fs/promises";
// @ts-ignore
import { File } from "buffer";
import path from "path";

// external
import axios from "axios";
import FormData from "form-data";
import { archiveChannel } from "revchiver";

export const name = "archive";
export const aliases = [];
export const description = globalStrings.archive.description;
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const sleep = (ms: number | undefined) =>
			new Promise((r) => setTimeout(r, ms));

		const autumnURL = msg.client.configuration?.features.autumn.url;
		async function uploadFile(
			file: Buffer,
			filename: string,
			file2: File
		): Promise<string> {
			let data = new FormData();
			// let data2 = new FormData();
			data.append("file", file, { filename: filename });
			/// data2.append("file", file2);

			const headers = data.getHeaders();
			// const headers2 = data2.getHeaders();
			let req = await axios.post(`${autumnURL}/attachments`, data, {
				headers: headers,
			});
			// let req2 = await axios.post(`${autumnURL}/attachments`, data2, {
			// 	headers: headers2,
			// });
			return (req.data as any)["id"] as string;
		}

		const botMsg = await msg.channel?.sendMessage(
			globalStrings.archive.fetchingInfo
		);
		const archiveData = await archiveChannel(msg, [botMsg!]);

		// create file
		await botMsg?.edit({ content: globalStrings.archive.creatingFile });
		const rawjson = JSON.stringify(archiveData, null, 4);

		// remove empty pair of curly brackets ({}); also, just in case...
		// prettier-ignore
		const regex = new RegExp("        {},\n");
		const json = rawjson.replace(regex, "");

		// define filenames
		const filename = `archive_${msg.channel_id}_${msg.createdAt}.json`;
		const dir = `data/archives/${filename}`;

		const file = new File([rawjson], filename);

		const __dirname = path.resolve();
		const resolvedDir = path.resolve(__dirname, `${dir}`);

		// create file
		await writeFile(dir, json);
		botMsg?.edit({
			content: globalStrings.archive.archiveComplete(
				msg.channel_id,
				filename
			),
		});

		const archiveBuffer = await readFile(resolvedDir);
		const attachment = await uploadFile(archiveBuffer, filename, file);
		msg.channel?.sendMessage({
			content: " ",
			attachments: [attachment],
		});

		// wait 30 minutes before deleting file
		await sleep(1800000);

		await unlink(dir);
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
		handleError(msg, err, "error");
	}
}
