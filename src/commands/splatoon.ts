import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError } from "../modules/functions";

import dayjs from "dayjs";

export const name = "splatoon";
export const aliases = ["splat3"];
export const description =
	"See which stages/modes are currently playable in Splatoon 3. *This data is kindly provided by [splatoon3.ink](<https://splatoon3.ink>).*";
export const developer = false;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		/**
		 * Returns the relevant emoji for the provided mode.
		 * @param mode String (the mode's internal ID)
		 */
		function getModeIcon(mode: string) {
			switch (mode) {
				// Splat Zones
				case "AREA":
					return ":01GDBWYA6ZX4S9HT5FJ5RQRSKF:";
				// Clam Blitz
				case "CLAM":
					return ":01GDBWZJ2N4G2MXGT1KRX6RV9M:";
				// Rainmaker
				case "GOAL":
					return ":01GDBWZXNW1STKFE7ZE7S54R70:";
				// Tower Control
				case "LOFT":
					return ":01GDBX0BP3EYNWT62SMQJNPXVX:";
				// Default
				default:
					return "";
			}
		}
		const url = `https://splatoon3.ink/data/schedules.json`;
		const options = {
			headers: {
				"User-Agent": globalStrings.splatoon.userAgent,
			},
		};
		const rawData = await fetch(url, options);
		const data = ((await rawData.json()) as any).data;
		if (data) {
			// base objects (including start/end times)
			const turfWarBase = data.regularSchedules.nodes[0]; // regular battle (turf war)
			const rankedBase = data.bankaraSchedules.nodes[0]; // anarchy battle (both open and series)
			const festBase = data.festSchedules.nodes[0]; // splatfest schedules

			// check if there's a splatfest
			const ongoingSplatfest = data.currentFest?.id ? true : false;

			// stages
			const turfWarStages = ongoingSplatfest
				? null
				: turfWarBase.regularMatchSetting?.vsStages;
			const rankedStagesOpen = ongoingSplatfest
				? null
				: rankedBase.bankaraMatchSettings[1].vsStages;
			const rankedStagesSeries = ongoingSplatfest
				? null
				: rankedBase.bankaraMatchSettings[0].vsStages;
			const festStages = ongoingSplatfest
				? festBase.festMatchSetting?.vsStages
				: null;

			// modes (for anarchy battle)
			const rankedModeOpen = ongoingSplatfest
				? null
				: rankedBase.bankaraMatchSettings[1].vsRule;
			const rankedModeSeries = ongoingSplatfest
				? null
				: rankedBase.bankaraMatchSettings[0].vsRule;

			// get the relevant emoji
			const regularBattleEmoji = ":01GDBXA053N10EBQ3FR5ADDBXW:";
			const rankedOpenEmoji = ongoingSplatfest
				? null
				: getModeIcon(rankedModeOpen.rule);
			const rankedSeriesEmoji = ongoingSplatfest
				? null
				: getModeIcon(rankedModeSeries.rule);

			// generate timestamp from end time
			const timestamp = dayjs(turfWarBase.endTime).unix(); // rotations happen at the same time for regular/anarchy battles

			msg.channel?.sendMessage({
				content: " ",
				embeds: [
					{
						title: globalStrings.splatoon.title,
						description: `The following modes/stages will be playable until <t:${timestamp}>:\n\n${
							ongoingSplatfest
								? `**Splatfest (*${data.currentFest.title}*) - Turf War**\n${festStages[0].name}, ${festStages[1].name}`
								: `**Regular Battle - Turf War ${regularBattleEmoji}**\n${turfWarStages[0].name}, ${turfWarStages[1].name}\n\n**Anarchy Battle (Open) - ${rankedModeOpen.name} ${rankedOpenEmoji}**\n${rankedStagesOpen[0].name}, ${rankedStagesOpen[1].name}\n\n**Anarchy Battle (Series) - ${rankedModeSeries.name} ${rankedSeriesEmoji}**\n${rankedStagesSeries[0].name}, ${rankedStagesSeries[1].name}`
						}\n\n*This data is kindly provided by [splatoon3.ink](<https://splatoon3.ink>).*`,
						url: globalStrings.splatoon.url,
						colour: globalStrings.embeds.accent,
					},
				],
			});
		} else {
			msg.channel?.sendMessage("Something went wrong :flushed:");
		}
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
		handleError(msg, err, "error");
	}
}
