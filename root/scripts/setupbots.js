/** @param {NS} ns **/

import { getUsableServers, botSetup } from "/lib/functions.js"
export async function main(ns) {
	var bots = getUsableServers(ns, "/data/servers.txt")

	for (let i = 0, len = bots.length; i < len; i++) {

		await botSetup(ns, bots[i].hostname)
	}

}