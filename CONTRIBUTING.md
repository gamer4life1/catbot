# Contributing to RexBot

This file contains information for potential contributors.

## Commands

Commands follow this template:

```ts
import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { getLanguage } from "../modules/functions.js";

export const name = "commandname";
export const aliases = ["list", "any", "aliases", "here"];
export const description =
	"Describe what the command does. Used for the help command.";
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		/* command code */
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
	}
}
```

### Option usage

#### `name`

The command's name. This should be all lowercase, should _not_ contain the bot's prefix or spaces, and usually shouldn't be split with hyphens.

#### `aliases`

An object consisting of aliases for the command. These can be used instead of the command's name to run the command. Like command names, these should be lowercase and should _not_ contain the prefix or spaces, although hyphenated forms of the command name may be accepted. These should be split with a comma.

#### `description`

A description of what the command does. This should be as brief as possible while containing enough info that most people would be able to tell what the command does.

#### `usage`

An example of how to use the command. Use \<angle brackets> for required arguments, and [square brackets] for optional ones. Include the command's name at the start, but _not_ the prefix.

#### `developer`

Whether the command should be limited to users with the `developer` flag in their user config. This should be enabled for sensitive commands (e.g. bot management commands or `eval`). For most commands, set this to `false`.

#### `serverOnly`

Whether the command can only be used in servers. This should be set to `true` for server managment and most moderation commands. For most other commands, set this to `false`.

## Config system

RexBot uses JSON files (stored in `data/config`) to store user/server config.

### Examples

Here's an example of a user config file:

```json
{
	"type": "user",
	"language": "en_GB",
	"developer": false,
	"version": "0.1.0"
}
```

Here's an example of a server config file:

```json
{
	"type": "server",
	"known": true,
	"announcementChannel": "channelID",
	"version": "0.1.0"
}
```

### Notes

Each file should be named `<user/server id>.json` (for example, `01FEEFJCKY5C4DMMJYZ20ACWWC.json`). `version` is the config version.
