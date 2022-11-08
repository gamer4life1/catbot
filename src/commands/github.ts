import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError } from "../modules/functions";

export const name = "github";
export const aliases = ["gh"];
export const description =
	"Get info on a GitHub repository. The repository must be public.";
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
						title: globalStrings.github.noRepoTitle,
						description: globalStrings.github.noRepoDesc,
						colour: globalStrings.embeds.error,
					},
				],
			});
		} else {
			// prepare arg for usage
			const rawInput = args.join(" ");
			// prettier messes with the regex, so...
			// prettier-ignore
			const regex = new RegExp("http(s)?:\/\/github.com\/")
			const input = rawInput.replace(regex, "");

			// urls
			const url = `https://api.github.com/repos/${input}`;
			const commitsUrl = `https://api.github.com/repos/${input}/commits`;

			// fetch repo
			const rawData = await fetch(url);
			const repo = (await rawData.json()) as any;
			if (repo) {
				if (!repo.name)
					return msg.channel?.sendMessage({
						content: " ",
						embeds: [
							{
								title: "Repo does not exist",
								description:
									"That repository could not be found - did you spell its name correctly, and is it private? (RexBot can only fetch public repositories.)",
								colour: globalStrings.embeds.error,
							},
						],
					});
				const rawCommitData = await fetch(commitsUrl);
				const commits = (await rawCommitData.json()) as any;
				msg.channel?.sendMessage({
					content: " ",
					embeds: [
						{
							title: `${repo.full_name} on GitHub`,
							description: `${
								repo.description !== null
									? `${repo.description}`
									: "*This repostiory has no description.*"
							}
						\n**Topics**${
							repo.topics[0]
								? `\n\`${repo.topics.join("`, `")}\``
								: "*This repository has no topics.*"
						}
						\n**Latest commit**\n${
							commits[0]
								? `\`${commits[0].sha.slice(0, 7)}\`([link](${
										commits[0].html_url
								  }))`
								: "*This repository has no commits.*"
						}
						\n**Stars**\n${repo.stargazers_count} ${
								repo.stargazers_count === 1 ? "star" : "stars"
							}
						\n**Watchers**\n${repo.watchers_count} ${
								repo.watchers_count === 1
									? "watcher"
									: "watchers"
							}
						\n**Forks**\n${repo.forks_count} ${repo.forks_count === 1 ? "fork" : "forks"}
						\n**Links**\n[View on GitHub](${repo.html_url}) • [Issues](${
								repo.html_url
							}/issues) • [Pull requests](${
								repo.html_url
							}/pulls)${
								repo.homepage
									? ` • [Homepage (\`${repo.homepage}\`)](${repo.homepage})`
									: ""
							}`,
							colour: "var(--accent)",
						},
					],
				});
			} else {
				msg.channel?.sendMessage("Something went wrong :flushed:");
			}
		}
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
		handleError(msg, err, "error");
	}
}
