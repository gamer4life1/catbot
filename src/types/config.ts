export type ConfigBase = {
	// Whether this config file is for a user or a server
	type?: "user" | "server";
	// The config version
	version?: string;
};

export type UserConfig = ConfigBase & {
	// Whether the user is a developer or not
	developer?: boolean;
	// The user's preferred language
	language?: string;
};

// for future use 👀
export type ServerConfig = ConfigBase & {
	// The channel to send global announcements to
	announcementChannel?: string;
	// Whether the server is "known"
	known?: boolean;
};
