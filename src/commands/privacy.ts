import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB"; // `const { strings } = await import(langName);` for proper i18n support?

import { getUserConfig, handleError, translate } from "../modules/functions.js";

export const name = "privacy";
export const aliases = ["data"];
export const description = globalStrings.privacy.description;
export const usage = "privacy [viewconfig]";
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	async function getValues() {
		const config = await getUserConfig(msg.author_id);
		if (config) {
			const values = Object.entries(config);
			const formattedValues = [];
			for (const v of values) {
				formattedValues.push(`${v[0]}: ${v[1]}`);
			}
			return formattedValues;
		} else return "noConfig";
	}

	try {
		const showConfig = args[0] === "viewconfig";
		const config = showConfig ? await getValues() : "noConfig";

		const configString =
			config === "noConfig" ? config : config.join(",\n    ");
		const finalConfigString = showConfig
			? configString !== "noConfig"
				? `Here's your config:\n\`\`\`\n{\n    ${configString}\n}\n\`\`\``
				: "*You have no saved config.*"
			: "You can view your config info by passing the `viewconfig` argument.";

		msg.channel
			?.sendMessage(`*For the purposes of this message, "we" refers to RexBot's operator(s) - I (Rexo) and the bot's host (Error) are the only current operators.*
	\nWe care about your privacy and only store data that is necessary for the bot to function.
	\n### Logging
	\n- To track command usage and to help catch and fix bugs, the bot logs whenever you use a command. These logs follow the following format: \`[timestamp] [command used] Username (user ID) in channel #channel-name (channel id) of server Server Name (server ID) - rex!cmd args\`
	\n- These logs are non-permanent, and in future we may switch to some sort of command usage dashboard (reducing the necessity of these logs), add consistent log clearing and the ability to opt out of this logging in some way.
	\n- Errors/warnings are separately logged to a private channel in the Rexovolt server, only visible to those with the Developer role and the bot.
	\n### Archive files
	\nArchive files (produced by running \`rex!archive\`) are stored for a maximum of 30 minutes before being deleted - this is to ensure that, if the bot fails to send the archive file, it can still be retrieved for the archiver. We do not look at the contents of archive files.
	\n### COMING SOON: User config
	\nWe are currently working on adding a user config system. Your config information will be stored in an individual file. Only those who explicitly set or change their user config have config files - other users will use the default configuration for the bot.
	\n${finalConfigString}`);
	} catch (err) {
		msg.channel?.sendMessage(
			await translate(language, "errors.genericErrorWithTrace", {
				error: err,
			})
		);
		handleError(msg, err, "error");
	}
}
