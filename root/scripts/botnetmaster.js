/** @param {NS} ns **/

import { getHackableServers, scanServerData, getRootedServers, getRoot} from "/lib/functions.js"

export async function main(ns) {
	
	var targetServers = getHackableServers(ns)
	var botnetServers = getUsableServers(ns)
	var 
	
}