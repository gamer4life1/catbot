import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError, translate } from "../modules/functions";

export const name = "create";
export const aliases = ["channel", "newchannel"];
export const description = "Creates a new channel.";
export const usage = "create <text|voice> <name> [description]";
export const developer = false;
export const serverOnly = true;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		// initial checks
		if (!args[0])
			return msg.channel?.sendMessage({
				embeds: [
					{
						title: "Missing arguments",
						description:
							"Please specify a channel type (`text` or `voice`), a channel name and (optionally) a description.",
						colour: globalStrings.embeds.error,
					},
				],
			});

		// arg checks
		const typeLower = args[0].toLowerCase();
		const type = typeLower.charAt(0).toUpperCase() + typeLower.slice(1);
		console.log(args[0], typeLower, type);
		if (type !== "Text" && type !== "Voice")
			return msg.channel?.sendMessage({
				embeds: [
					{
						title: "Argument error",
						description:
							"The channel type is the first arg - make sure it's either `text` or `voice`.",
						colour: globalStrings.embeds.error,
					},
				],
			});
		if (!args[1])
			return msg.channel?.sendMessage({
				embeds: [
					{
						title: "Argument error",
						description:
							"Please specify a name for your channel. For now, we don't support spaces in channel names - use hyphens instead.",
						colour: globalStrings.embeds.error,
					},
				],
			});
		try {
			const name = args[1];
			const description = args[2] ? args.slice(2).join(" ") : "";

			const c = await msg.channel?.server?.createChannel({
				type,
				name,
				description,
			});
			msg.channel?.sendMessage({
				embeds: [
					{
						title: "Channel created",
						description: `Check it out: <#${c?._id}>`,
						colour: globalStrings.embeds.success,
					},
				],
			});
		} catch (error) {
			const e = error as string;
			console.log(e);
			if (e.match("403"))
				msg.channel?.sendMessage(
					"# Permission error\nMake sure the bot has a role with the `Manage Channels` permission."
				);
			else
				msg.channel?.sendMessage(
					`# Something went wrong!\nSomething broke. Here's the error:\n\`\`\`${e}\`\`\``
				);
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
