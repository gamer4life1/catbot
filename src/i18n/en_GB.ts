export const globalStrings = {
	among: {
		description: "sussy dev command",
	},
	archive: {
		description: "Archives the current channel's messages.",
		fetchingInfo: "Fetching info...",
		fetchingMessages: "Fetching messages...",
		creatingFile: "Creating archive file...",
		archiveComplete: (channelid: string, filename: string) => {
			return `Finished archiving <#${channelid}>! The file should appear below shortly. If not, ask Rexo to give you a copy [in RexBot's support server](<https://rvlt.gg/ra9dr2Rd>) - mention that the file name is \`${filename}\`.`;
		},
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
		pingPrefix: (prefix: string) => {
			return `Hey! My prefix is \`${prefix}\`.`;
		},
		noDesc: "No description.",
	},
	npm: {
		npmTitle: (name: string) => {
			return `${name} on NPM`;
		},
		pkgNoDescription: "*This library has no description.*",
		noResultsTitle: "No results",
		noResultsDescription:
			"There were no results for your query - did you type the package's name correctly?",
		latestVer: "**Latest version**",
	},
	ping: {
		description: "Pong.",
		pong: "Pong!",
		embedDescription: (time: number) => {
			return `This took ${time}ms.`;
		},
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
	wikipedia: {
		noExtract:
			"*No extract available - feel free to take a look at the page using the links below*",
		cannotFindArticle: (input: string) => {
			return `${input} doesn't seem to be an article - did you spell the title correctly?`;
		},
		userAgent:
			"RexBot/1.0 (https://github.com/rexogamer/rexbot, User:Remagoxer)",
	},
	errors: {
		genericError: "Something went wrong :flushed:",
		genericErrorWithTrace: (trace: any) => {
			return `Something went wrong! Please report the following to RexBot's devs:\n\`\`\`js\n${trace}\n\`\`\``;
		},
		genericErrorWithTraceConsole: (trace: any) => {
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
