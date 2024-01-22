import { Client, Message } from "revolt.js";

import { Command, Context } from "../types/command";

import { globalStrings } from "../i18n/en_GB";

import type { ServerConfig, UserConfig } from "../types/config";
import { BotFramework } from "./framework";

// external libs
import dayjs from "dayjs";
import Polyglot from "node-polyglot";

const polyglot = new Polyglot({
	phrases: globalStrings,
	interpolation: { prefix: "{{", suffix: "}}" },
});

// node builtins
import { readFile, writeFile } from "fs/promises";
import path from "path";

export function generateTimestamp() {
	return dayjs(new Date().getTime()).toISOString();
}

export async function handleError(
	msg: Message, // needed for the client
	error: any,
	type: "warning" | "error"
) {
	const loggingChannelId = process.env.LOGGING_CHANNEL ?? null;
	if (!loggingChannelId) {
		return console.log(error);
	}
	const loggingChannel = await msg.client.channels.fetch(loggingChannelId);
	if (!loggingChannel) {
		return console.log(error);
	}
	try {
		return loggingChannel.sendMessage(
			`**New ${
				type === "error" ? "error :bangbang:" : "warning :warning:"
			}**\n\`\`\`\n${error}\n\`\`\``
		);
	} catch {
		return console.log(error);
	}
}

export async function isValidContext(
	msg: Message,
	isDev: boolean,
	language: string,
	bot: BotFramework
): Promise<Context> {
	let values: Context = { command: null, args: [], canExecute: false };

	// ignore system messages
	if (!msg.content) return values;

	// if someone mentions the bot at the start of a message, reply to them with the prefix
	const prefixMention = new RegExp(`^<@!?${bot.client.user!._id}>.*$`);

	const botPinged = prefixMention.test(msg.content);
	if (botPinged)
		translate(language, "help.pingPrefix", { prefix: bot.prefix }).then(
			(string) => {
				msg.channel?.sendMessage(string);
			}
		);

	if (!msg.content.startsWith(bot.prefix)) return values;

	const args = msg.content.slice(bot.prefix.length).split(" ");
	const commandName = args.shift();
	const command: Command = getCommand(commandName as string, bot);
	values.command = command;
	values.args = args;

	if (!command) return values;

	const issues = await commandChecks(msg, command, isDev, language, bot);

	if (!issues) values.canExecute = true;
	return values;
}

export async function commandChecks(
	msg: Message,
	command: Command,
	isDev: boolean,
	language: string,
	bot: BotFramework
) {
	if (command.developer && !isDev) {
		msg.channel?.sendMessage(
			await translate(language, "errors.devOnlyCommand")
		);
		return true;
	} else if (command.serverOnly && !msg.channel?.server) {
		msg.channel?.sendMessage(
			await translate(language, "errors.serverOnlyCommand")
		);
		return true;
	} else return false;
}

export function getCommand(value: string, bot: BotFramework) {
	return bot.commands.find(
		(cmd) => cmd.name === value || cmd.aliases.includes(value)
	);
}

/**
 * Resolves the directory for the given config file
 * @param id ID of the user/server
 */
function getDir(id: string) {
	const dir = `data/config/${id}.json`;
	const __dirname = path.resolve();
	const resolvedDir = path.resolve(__dirname, `${dir}`);
	return resolvedDir;
}

/**
 * Fetches config info for the provided user/server
 * @param id ID of the user/server
 */
async function getConfig(
	id: string
): Promise<UserConfig | ServerConfig | null> {
	const resolvedDir = getDir(id);
	try {
		const file = await readFile(resolvedDir);
		const readData = file.toString("utf8");
		const config = await JSON.parse(readData);
		if (config.type !== null) {
			return config;
		} else {
			return null;
		}
	} catch (err) {
		return null;
	}
}

/**
 * Sets the specified config key to the specified value
 * @param id The user/server's ID
 * @param key The config key to change
 * @param value The new value
 */
export async function setConfig(id: string, key: any, value: any) {
	try {
		let originalConfig = (await getConfig(id)) as any;
		if (originalConfig) {
			let newConfig = originalConfig;
			newConfig[key] = value;
			const newConfigAsJSON = JSON.stringify(newConfig, null, 4);
			try {
				const resolvedDir = getDir(id);
				await writeFile(resolvedDir, newConfigAsJSON);
			} catch (err) {
				console.log(err);
				return null;
			}
		}
	} catch (err) {
		console.log(err);
		return null;
	}
}

/**
 * Fetches config info for the provided user
 * @param id The user's ID
 * @returns The user's config (as a UserConfig object) or null
 */
export async function getUserConfig(id: string): Promise<UserConfig | null> {
	const config = getConfig(id);
	if (config !== null) {
		return config as UserConfig;
	} else {
		return null;
	}
}

/**
 * Fetches config info for the provided server
 * @param id The server's ID
 * @returns The server's config (as a ServerConfig object) or null
 */
export async function getServerConfig(
	id: string
): Promise<ServerConfig | null> {
	const config = getConfig(id);
	if (config !== null) {
		return config as ServerConfig;
	} else {
		return null;
	}
}

/**
 * Fetches the provided language or the provided user's language and its strings
 */
async function getLanguage(
	id: string,
	isLanguage?: boolean
): Promise<any | null> {
	try {
		const config = await getUserConfig(id);
		const rawData = isLanguage
			? await import(`../i18n/${id}`)
			: config
			? await import(`../i18n/${config?.language}`)
			: null;
		const object = rawData.strings;
		return object;
	} catch (err) {
		return null;
	}
}

/**
 * Fetch the translated version of the given string
 * @param language The local language to use
 * @param string The string to translate
 * @param data Extra data used for template strings
 */
export async function translate(
	language: string,
	string: string,
	data?: any
): Promise<string> {
	try {
		const localStrings =
			language === "en_GB" ? null : await getLanguage(language, true);

		// clean up each time in case the user switches languages
		polyglot.replace(globalStrings);
		if (localStrings) {
			polyglot.extend(localStrings);
		}

		const s = polyglot.t(string, data);
		console.log(s);
		return s;
	} catch (err) {
		return " ";
	}
}

/**
 * Uploads the provided Buffer to Autumn
 * @param client The Client object, used to get the Autumn URL
 * @param file The Buffer to upload
 * @param filename The file name the file will be uploaded with
 */
export async function uploadFile(
	client: Client,
	buffer: Buffer,
	filename: string
): Promise<string> {
	const autumnURL = client.configuration?.features.autumn.url;

	const blob = new Blob([buffer]);

	const file = new File([blob], filename);

	let data = new FormData();
	data.append("file", file);

	let req = await fetch(`${autumnURL}/attachments`, {
		method: "POST",
		body: data,
	});
	return (await req.json())["id"] as string;
}

/**
 * Wait for the given amount of time before doing anything else
 * @param ms The amount of time to wait for (in milliseconds)
 */
export const sleep = (ms: number | undefined) =>
	new Promise((r) => setTimeout(r, ms));
