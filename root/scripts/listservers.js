/** @param {NS} ns **/

import { readServerData } from "/lib/functions.js"

export async function main(ns) {

	var path = ns.args[0]
	var servers = readServerData(ns, path)
	for (var i = 0, len = (servers.length); i < len; i++) {

		ns.tprintf("> %s \n Root: %s  Ports Needed: %s \n Hacking Skill: %s RAM: %s", servers[i].hostname, servers[i].hasAdminRights, servers[i].numOpenPortsRequired, servers[i].requiredHackingSkill, servers[i].maxRam)
	}

}