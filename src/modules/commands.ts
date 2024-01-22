import { generateTimestamp } from "./functions";
import { Command } from "../types/command";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = fileURLToPath(import.meta.url);
const currentDir = path.dirname(dir);
const parentDir = path.dirname(currentDir);

const commandsFiles = fs.readdirSync(`${parentDir}/commands`);

const loadedCommands = [];

for (const file of commandsFiles) {
	if (
		(!file.endsWith(".js") && !file.endsWith(".ts")) ||
		file.endsWith(".d.ts")
	)
		continue;
	const fileName = file.split(".");
	try {
		loadedCommands.push(await import(`../commands/${fileName[0]}.ts`));
		console.log(
			`[${generateTimestamp()}] [commands] Loaded command file ${file}!`
		);
	} catch (error) {
		loadedCommands.push(await import(`../commands/${fileName[0]}.js`));
		console.log(
			`[${generateTimestamp()}] [commands] Loaded command file ${file}!`
		);
	}
}

export const commands = loadedCommands as Command[];
