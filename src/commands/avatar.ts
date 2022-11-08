import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError } from "../modules/functions";

export const name = "avatar";
export const aliases = ["av"];
export const description = globalStrings.avatar.description;
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message) {
	try {
		const mentionedUser = msg.mention_ids
			? msg.client.users.get(msg.mention_ids[0])
			: null;
		const avatarUrl = `https://autumn.revolt.chat/avatars/${
			mentionedUser ? mentionedUser.avatar?._id : msg.author?.avatar?._id
		}/${
			mentionedUser
				? mentionedUser.avatar?.filename
				: msg.author?.avatar?.filename
		}`;
		return msg.channel?.sendMessage({
			content: `[**Link**](<${avatarUrl}>)`,
			embeds: [
				{
					title: "RexBot",
					description: `**${
						mentionedUser ? `${mentionedUser.username}'s` : "Your"
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
