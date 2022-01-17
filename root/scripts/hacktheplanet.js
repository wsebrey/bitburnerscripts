/** @param {NS} ns **/
//TODO - update for use with new readServerData format
import { getRoot, readServerData, scanServerData } from "/lib/functions"

export async function main(ns) {

	var servers = readServerData(ns, "/data/servers.txt")
	var portsAvail = 0

	ns.tprintf("Hack the Planet! \n Root Gained on:")

	if (ns.fileExists("SQLInject.exe")) {
		portsAvail = 5

	}
	else if (ns.fileExists("HTTPWorm.exe")) {
		portsAvail = 4

	}
	else if (ns.fileExists("relaySMTP.exe")) {
		portsAvail = 3

	}
	else if (ns.fileExists("FTPCrack.exe")) {
		portsAvail = 2

	}
	else if (ns.fileExists("BruteSSH.exe")) {
		portsAvail = 1
	}
	for (let i = 0, len = servers.length; i < len; i++) {

		var rooted = false

		if ((portsAvail >= servers[i].openPortsRequired) && (servers[i].root == "false")) {
			rooted = getRoot(ns, servers[i].hostname)

			if (rooted) {
				ns.tprintf(servers[i].hostname)
			}
		}
	}
	await scanServerData(ns, "/data/servers.txt")
}