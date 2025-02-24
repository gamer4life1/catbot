import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError, translate } from "../modules/functions";

export const name = "wikipedia";
export const aliases = ["wiki", "wp", "wikisearch"];
export const description =
	"Returns information for articles on the English Wikipedia.";
export const usage = "wikipedia <article>";
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const input = args.join(" ");
		if (!input) {
			return msg.channel?.sendMessage({
				content: " ",
				embeds: [
					{
						title: "No article specified",
						description: "You need to specify an article.",
						colour: "var(--error)",
					},
				],
			});
		} else {
			const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
				args.join(" ")
			)}?redirect=true`;
			const notFoundType =
				"https://mediawiki.org/wiki/HyperSwitch/errors/not_found";
			const options = {
				headers: {
					"User-Agent": globalStrings.wikipedia.userAgent,
				},
			};
			try {
				const rawData = await fetch(url, options);
				const data = await rawData.json();
				if (data) {
					// article not found, return error message
					if (data.type === notFoundType)
						return msg.channel?.sendMessage({
							content: " ",
							embeds: [
								{
									title: "Article not found",
									description: await translate(
										language,
										"wikipedia.cannotFindArticle",
										{ input: input }
									),
									colour: "var(--error)",
								},
							],
						});
					// check if article has extract
					const noExtract = data.type === "no-extract";
					msg.channel?.sendMessage({
						content: " ",
						embeds: [
							{
								title: `${data.title} on Wikipedia`,
								description: `*${
									data.description ??
									"This article has no short description."
								}*
							\n**Extract**\n${
								noExtract
									? globalStrings.wikipedia.noExtract
									: `${data.extract}`
							}
							\n**Links**\n[View article](<${
								data.content_urls.desktop.page
							}>) ([mobile view](<${
									data.content_urls.mobile.page
								}>)) • [Page history](<${
									data.content_urls.desktop.history
								}>) ([mobile view](<${
									data.content_urls.mobile.history
								}>))`,
								colour: "var(--accent)",
							},
						],
					});
				} else {
					msg.channel?.sendMessage(
						globalStrings.errors.couldNotFetchData
					);
				}
			} catch (error) {
				msg.channel?.sendMessage(
					await translate(language, "errors.genericErrorWithTrace", {
						error: error,
					})
				);
			}
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
