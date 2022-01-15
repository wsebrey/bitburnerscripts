/** @param {NS} ns **/

import { hackCount, growCount, weakenCount, getUsableServers } from "/lib/functions"

export async function main(ns) {
	
	var target
	var weakenThreads
	var growThreads
	var hackThreads
	var botnetHosts = getUsableServers(ns)
	var home = ns.getServer("home"))
	
	start:
	while (true) {
		
		target = ns.getServer(ns.args[0])
		home = ns.getServer("home"))
		homeRamFree = home.maxRam - home.ramUsed - 500
	
		while (target.hackDifficulty > (target.minDifficulty * 1.05)) {
			
			weakenThreads = weakenCount(ns, target, true)
			
			if ((weakenThreads * 1.75) < homeFreeRam) {
				
				ns.exec("/scripts/weaken.js", "home", weakenThreads, target.hostname))
				
				while (ns.isRunning("/scripts/weaken.js", "home", weakenThreads, target.hostname)) {
					
					await ns.asleep(10000)
					
				}
				continue start;
			}
			
		}
		
		await ns.asleep(1000)
		
	}
	
	

}

