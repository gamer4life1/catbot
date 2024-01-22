export const globalStrings = {
	among: {
		description: "sussy dev command",
	},
	archive: {
		description: "Archives the current channel's messages.",
		fetchingInfo: "Fetching info...",
		fetchingMessages: "Fetching messages...",
		creatingFile: "Creating archive file...",
		archiveComplete:
			"Finished archiving <#{{id}}>! The file should appear below shortly. If not, ask Rexo to give you a copy [in RexBot's support server](<https://rvlt.gg/ra9dr2Rd>) - mention that the file name is `{{filename}}`.",
	},
	avatar: {
		description:
			"Returns the first mentioned user's avatar (or if no users are mentioned, the author's).",
	},
	config: {
		description: "View, edit or delete your RexBot config.",
	},
	github: {
		noRepoTitle: "No repository specified",
		noRepoDesc: "You need to specify a repository.",
	},
	help: {
		pingPrefix: "Hey! My prefix is `{{prefix}}`.",
		noDesc: "No description.",
	},
	npm: {
		npmTitle: "{{name}} on NPM",
		pkgNoDescription: "*This library has no description.*",
		noResultsTitle: "No results",
		noResultsDescription:
			"There were no results for your query - did you type the package's name correctly?",
		latestVer: "**Latest version**",
	},
	ping: {
		description: "Pong.",
		pong: "Pong!",
		embedDescription:
			"This took {{time}}ms.\n\n**Extra info**\nHost: `{{host}}`\nGit commit: `{{commit}}`",
	},
	privacy: {
		description: "View RexBot's privacy policy and your saved config.",
	},
	shutdown: {
		response: "Shutting down...",
	},
	splatoon: {
		title: "Splatoon 3's current stages/modes",
		url: "https://splatoon3.ink/",
		userAgent:
			"RexBot/1.0 (https://github.com/rexogamer/rexbot, Rexowogamer#1183)",
	},
	theme: {
		description:
			"Prepare your custom theme for submission to Revolt's [Theme Store](<https://github.com/revoltchat/themes>).",
		converting: "Converting...",
		preparingFile: "Preparing file...",
		themeReady:
			"Your theme file is ready! The file should appear below shortly. If not, ask Rexo to give you a copy [in RexBot's support server](<https://rvlt.gg/ra9dr2Rd>) - mention that the file name is `{{filename}}`.\n\nHere's a basic overview of the next steps - if you need any help, feel free to ask in the Revolt Lounge's Themes channel:\n* Rename the file to `Preset.toml` and save it in a folder with the same name as the slug\n* Fork [the Theme Store repo](<https://github.com/revoltchat/themes>), clone it locally and upload your local folder under the `data` folder (for example, `data/turquoise-theme` containing your `Preset.toml` file)\n* Push your changes and open a pull request",
	},
	wikipedia: {
		noExtract:
			"*No extract available - feel free to take a look at the page using the links below*",
		cannotFindArticle:
			"{{input}} doesn't seem to be an article - did you spell the title correctly?",
		userAgent:
			"RexBot/1.0 (https://github.com/rexogamer/rexbot, User:Remagoxer)",
	},
	errors: {
		genericError: "Something went wrong :flushed:",
		genericErrorWithTrace:
			"Something went wrong! Please report the following to RexBot's devs:\n```js\n{{error}}\n```",
		genericErrorWithTraceConsole: (trace: unknown) => {
			return `Something went wrong while executing the above command - here's the trace:\n\n${trace}`;
		},
		couldNotFetchData: "There was an issue fetching the data.",
		serverOnlyCommand: "This command can only be used in servers.",
		devOnlyCommand:
			"This command can only be used by the bot's developers.",
	},
	embeds: {
		accent: "var(--accent)",
		error: "var(--error)",
		success: "var(--success)",
	},
};
