import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError, translate } from "../modules/functions";

export const name = "npm";
export const aliases = ["npmsearch"];
export const description = "Search packages on NPM.";
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
						title: "No package specified",
						description: "You need to specify a package.",
						colour: "var(--error)",
					},
				],
			});
		} else {
			const url = `https://api.npms.io/v2/search?q=${encodeURIComponent(
				args.join(" ")
			)}`;
			const rawData = await fetch(url);
			const data = (await rawData.json()) as any;
			if (data) {
				if (data.total === 0)
					return msg.channel?.sendMessage({
						content: " ",
						embeds: [
							{
								title: globalStrings.npm.noResultsTitle,
								description:
									globalStrings.npm.noResultsDescription,
								colour: "var(--error)",
							},
						],
					});

				const pkg = data.results[0].package;
				msg.channel?.sendMessage({
					content: " ",
					embeds: [
						{
							title: await translate(language, "npm.npmTitle", {
								package: pkg.name,
							}),
							description: `${
								pkg.description ??
								globalStrings.npm.pkgNoDescription
							}\n${
								pkg.keywords
									? `\n**Keywords**\n\`${pkg.keywords.join(
											"`, `"
									  )}\`\n`
									: ""
							}\n${globalStrings.npm.latestVer}\nv${
								pkg.version
							}\n\n**Links**\n[View on NPM](${pkg.links.npm}) ${
								pkg.links.homepage
									? ` • [Homepage](${pkg.links.homepage})`
									: ""
							} ${
								pkg.links.repository
									? ` • [Repository](${pkg.links.repository})`
									: ""
							}`,
							url: pkg.links.npm,
							colour: globalStrings.embeds.accent,
						},
					],
				});
			} else {
				msg.channel?.sendMessage("Something went wrong :flushed:");
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
