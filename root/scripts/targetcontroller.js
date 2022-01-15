/** @param {NS} ns **/

import { hackCount, growCount, weakenCount, assignBots } from "/lib/functions"

export async function main(ns) {
	
	var target
	var weakenThreads
	var growThreads
	var hackThreads
	var assignedBots = []
	var home = ns.getServer("home"))
	
	while (true) {
		
		target = ns.getServer(ns.args[0])
		home = ns.getServer("home"))
		homeRamFree = home.maxRam - home.ramUsed - 500
	
		while (target.hackDifficulty > (target.minDifficulty * 1.05)) {
			
			weakenThreads = weakenCount(ns, target, true)
			
			if ((weakenThreads * 1.75) < homeFreeRam) {
				
				ns.exec("/scripts/weaken.js", "home", weakenThreads, target.hostname))
				
				while (ns.isRunning("/scripts/weaken.js", "home", weakenThreads, target.hostname)) {
					
					await ns.asleep(5000)
					
				}

			} else {
				// WILL NEED TO BE MADE COMPATIBILE WITH planned changes to assignBots
				weakenThreads = weakenCount(ns, target)
				assignedBots = assignBots(ns, "/scripts/weaken.js", target.hostname, weakenThreads)
				
				for (var i = 0, len = assignedBots.len; i < len; i++) {
					
					while (ns.isRunning("/scripts/weaken.js", ))
					
				}
				
			}
			
		}
		
		/* while (target.moneyAvailable < (target.maxMoney * 0.9)) {
			
			growThreads = growCount(ns, target)
			
		} */
		
		await ns.asleep(1000)
		
	}
	
	

}

