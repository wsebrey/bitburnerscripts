/** @param {NS} ns **/

import {getHackableServers} from "/lib/functions"

export async function main(ns) {

	var servers = getHackableServers(ns)
	ns.tprintf("You have can hack:")
	ns.tprintf("Hackable Servers:")
	servers.forEach(server => ns.tprintf(server.hostname))

}