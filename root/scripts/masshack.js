/** @param {NS} ns **/

import { getHackableServers, getUsableServers, botSetup } from "/lib/functions.js"

export async function main(ns) {

	var servers = getUsableServers(ns, "/data/servers.txt")
	var targets = getHackableServers(ns, "/data/servers.txt")



	for (let i = 0, len = servers.length; i < len; i++) {

		if (ns.fileExists("/scripts/hack.js", servers[i].hostname) == false || ns.fileExists("/scripts/grow.js", servers[i].hostname) == false || ns.fileExists("/scripts/weaken.js", servers[i].hostname) == false) {
			await botSetup(servers[i])
		}

	}

	for (let i = 0, len = targets.length; i < len; i++) {
		if (ns.isRunning("/scripts/targetcontroller.js", "home", targets[i].hostname) == false) {
			ns.run("/scripts/targetcontroller.js", 1, targets[i].hostname)
			ns.tprint("Target Controller launched: " + targets[i].hostname)
		}
	}




}