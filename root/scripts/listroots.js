/** @param {NS} ns **/

import { getRootedServers } from "/lib/functions"

export async function main(ns) {

	var path = ns.args[0]
	var roots = getRootedServers(ns, path)
	ns.tprintf("You have Root on:")
	for (var i = 0, len = roots.length; i < len; i++) {
		ns.tprintf(roots[i].hostname)
	}
}