/** @param {NS} ns **/

import { getServerByName } from "/lib/functions"
export async function main(ns) {
	var server = getServerByName(ns, ns.args[0], ns.args[1])
	ns.tprint(server)

}