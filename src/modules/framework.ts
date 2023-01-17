import { Client, Message } from "revolt.js";
import { commands } from "./commands.js";
import { statuses } from "../config/statuses.js";
import { globalStrings } from "../i18n/en_GB.js";
import {
	handleError,
	generateTimestamp,
	getServerConfig,
	getUserConfig,
	isValidContext,
} from "./functions.js";
import { ulid } from "ulid";

export class BotFramework {
	client: Client;
	prefix: string;
	commands = commands;

	constructor(client: Client, prefix: string) {
		this.client = client;
		this.prefix = prefix;

		this.client.on("connecting", async () => {
			console.info(`[${generateTimestamp()}] [client] Connecting...`);
		});
		this.client.on("connected", async () => {
			console.info(`[${generateTimestamp()}] [client] Connected!`);
		});
		this.client.on("ready", async () => {
			try {
				const id = client.user!._id;
				console.info(
					`[${generateTimestamp()}] [client] Logged in as ${
						client.user!.username
					} (${id})!`
				);

				let servers = "Other servers:\n";
				let knownServersMsg = "Known servers:\n";

				for (const server of client.servers) {
					const firstChannel =
						server[1].orderedChannels[0].channels[0] ??
						server[1].orderedChannels[1].channels[0];
					const msg = `${server[1].name} (${server[1]._id}) (first channel: ${firstChannel?.name} (${firstChannel?._id}))\n`;
					const isKnown = (await getServerConfig(server[1]._id))
						?.known;

					isKnown ? (knownServersMsg += msg) : (servers += msg);

					// example code - send a message to every known server; will probably be reused/tweaked for an announcements system

					// if (isKnown) {
					// 	try {
					// 		if (firstChannel.havePermission("SendMessage")) {
					// 			firstChannel?.sendMessage("testing");
					// 		}
					// 	} catch (e) {
					// 		null; // banish error to the void
					// 	}
					// }
				}
				console.log(`${knownServersMsg}\n${servers}`);

				// change the bot's status every 10 minutes
				setInterval(async () => {
					try {
						const index =
							Math.floor(Math.random() * statuses.length + 1) - 1;
						const newStatus = statuses[index];
						await client.api.patch(`/users/@me`, {
							status: newStatus,
						});
					} catch (err) {
						console.log(
							`[${generateTimestamp()}] [client] Failed to change status:\n${err}`
						);
					}
				}, 300000);
			} catch (err) {
				console.log(
					`Something went wrong trying to connect to Revolt:\n${err}`
				);
			}
		});

		this.client.on("dropped", async () => {
			console.log(`[${generateTimestamp()}] [client] Dropped!`);
		});

		this.client.on("message", async (msg: Message) => {
			try {
				const botids = process.env.ALLOWEDBOTS?.split(",");
				if (
					!msg.author ||
					(msg.author.bot && !botids?.includes(msg.author._id))
				)
					return;

				// get user config (language, dev status, and in future log anonymity)
				const userConf = await getUserConfig(msg.author._id);

				const language = userConf?.language ?? "en_GB";
				const isDev = userConf?.developer ?? false;

				// check if the user has the right perms/whether the command can run in dms/servers
				const context = isValidContext(msg, isDev, this);
				if (!context.command || !context.canExecute) return;

				// log command usage
				const usageID = ulid();

				console.info(
					`[${generateTimestamp()}] [command used - ${usageID}] ${
						msg.author?.username
					} (${msg.author_id}) in channel #${msg.channel?.name} (${
						msg.channel_id
					}) of server ${msg.channel?.server?.name} (${
						msg.channel?.server_id
					}) - ` + `${msg.content}`
				);

				// check if the bot can send messages in the channel
				const hasSendMessages =
					msg.channel?.havePermission("SendMessage");
				if (hasSendMessages) {
					context.command.run(msg, language, context.args);
				} else {
					handleError(
						msg,
						`[${generateTimestamp()}] Failed command attempt (${usageID}) in channel without send perms (${
							msg.channel?._id
						})`,
						"warning"
					);
				}
			} catch (exc) {
				try {
					await msg.channel?.sendMessage(
						globalStrings.errors.genericErrorWithTrace(exc)
					);
					handleError(msg, exc, "error");
				} catch {
					console.log(exc);
				}
			}
		});
	}
}
