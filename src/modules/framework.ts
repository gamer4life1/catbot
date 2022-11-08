import { Client, Message } from "revolt.js";
import { commands } from "./commands.js";
import { statuses } from "../config/statuses.js";
import { globalStrings } from "../i18n/en_GB.js";
import {
	handleError,
	getServerConfig,
	getUserConfig,
	isValidContext,
} from "./functions.js";
import dayjs from "dayjs";
import { ulid } from "ulid";

export class BotFramework {
	client: Client;
	prefix: string;
	commands = commands;

	constructor(client: Client, prefix: string) {
		this.client = client;
		this.prefix = prefix;

		this.client.on("connecting", async () => {
			const timestamp = new Date().getTime();
			const time = dayjs(timestamp).toISOString();
			console.info(`[${time}] [client] Connecting...`);
		});
		this.client.on("connected", async () => {
			const timestamp = new Date().getTime();
			const time = dayjs(timestamp).toISOString();
			console.info(`[${time}] [client] Connected!`);
		});
		this.client.on("ready", async () => {
			const id = client.user!._id;
			const timestamp = new Date().getTime();
			const time = dayjs(timestamp).toISOString();
			console.info(
				`[${time}] [client] Logged in as ${
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
				const isKnown = (await getServerConfig(server[1]._id))?.known;

				isKnown ? (knownServersMsg += msg) : (servers += msg);

				// testing irt a particular server

				// if (server[1]._id === "01G5PV87HA6S5ETE5QV41CDB4Y") {
				// 	console.log("Channels in 01G5PV87HA6S5ETE5QV41CDB4Y");
				// 	for (const channel of server[1].channels) {
				// 		console.log(
				// 			`${channel?.name} (${
				// 				channel?._id
				// 			}) - last message: "${
				// 				channel?.last_message_id
				// 					? (
				// 							await channel?.fetchMessage(
				// 								channel?.last_message_id
				// 							)
				// 					  ).content
				// 					: "none"
				// 			}"`
				// 		);
				// 	}
				// }

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
				const index =
					Math.floor(Math.random() * statuses.length + 1) - 1;
				await client.api.patch(`/users/@me`, {
					// @ts-expect-error typing mismatch that shouldn't cause any issues
					status: statuses[index],
				});
			}, 300000);
		});

		this.client.on("dropped", async () => {
			const timestamp = new Date().getTime();
			const time = dayjs(timestamp).toISOString();
			console.log(`[${time}] [client] Dropped!`);
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
				const timestamp = new Date().getTime();
				const usageID = ulid();

				const time = dayjs(timestamp).toISOString();
				console.info(
					`[${time}] [command used - ${usageID}] ${msg.author?.username} (${msg.author_id}) in channel #${msg.channel?.name} (${msg.channel_id}) of server ${msg.channel?.server?.name} (${msg.channel?.server_id}) - ` +
						`${msg.content}`
				);

				// check if the bot can send messages in the channel
				const hasSendMessages =
					msg.channel?.havePermission("SendMessage");
				if (hasSendMessages) {
					context.command.run(msg, language, context.args);
				} else {
					handleError(
						msg,
						`Failed command attempt (${usageID}) in channel without send perms (${msg.channel?._id})`,
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
