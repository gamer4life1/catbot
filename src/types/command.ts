import { Message } from "revolt.js";

export interface Command {
	name: string;
	aliases: string[];
	description: string | null;
	usage: string | null;
	developer: boolean;
	serverOnly: boolean;
	attributes: {};
	run: (msg: Message, language: string, args: string[]) => Promise<void>;
}

export interface Context {
	command: Command | null;
	args: string[];
	canExecute: boolean;
}
