import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError } from "../modules/functions";

export const name = "avatar";
export const aliases = ["av"];
export const description = globalStrings.avatar.description;
export const usage = "ping [user ID/mention]";
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const arg = args[0];
		const idRegex = new RegExp("[0-9A-Z]{26}");
		const plainMention = idRegex.test(arg) ? arg : null;
		const mentionedUser = msg.mention_ids?.[0] ?? plainMention ?? null;
		const userObject = mentionedUser
			? msg.client.users.get(mentionedUser)
			: null;
		const avatarUrl = `https://autumn.revolt.chat/avatars/${
			userObject ? userObject.avatar?._id : msg.author?.avatar?._id
		}/${userObject?.avatar?.filename || msg.author?.avatar?.filename}`;
		return msg.channel?.sendMessage({
			content: `[**Link**](<${avatarUrl}>)`,
			embeds: [
				{
					title: "RexBot",
					description: `**${
						userObject ? `${userObject.username}'s` : "Your"
					} avatar**`,
					colour: globalStrings.embeds.accent,
					// media: avatarUrl,
				},
			],
		});
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
		handleError(msg, err, "error");
	}
}
