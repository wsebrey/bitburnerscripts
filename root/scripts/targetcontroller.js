/** @param {NS} ns **/

import { hackCount, growCount, weakenCount, assignBots, getServerByName } from "/lib/functions"

export async function main(ns) {
	
	var target = getServerByName(ns).find(server => server.hostname = ns.args[0])
	var weakenThreads
	var growThreads
	var hackThreads
	var trackedThreads = []
	var home = getHome(ns)
	var pid
	var weakenVal = ns.weakenAnalyze(1, home.cores)
	
	while (true) {
		weakenThreads = 0
		growThreads = 0
		hackThreads = 0
		target = ns.getServerByName(target.hostname)
		home = getHome(ns)
		homeRamFree = home.getFreeRam(ns) - 500
		
	
		while (target.getCurSecLevel(ns) > (target.minSecLevel * 1.05)) {
			
			weakenThreads = weakenCount(ns, target, true)
			
			if ((weakenThreads * 1.75) < homeFreeRam) {
				
				pid = ns.exec("/scripts/weaken.js", "home", weakenThreads, target.hostname))
				
				while (ns.isRunning(pid)) {
					
					await ns.asleep(5000)
					
				}

			} else {
				
				weakenThreads = weakenCount(ns, target)
				trackedThreads = assignBots(ns, "/scripts/weaken.js", target.hostname, weakenThreads)
				
				for (var i = 0, len = trackedThreads.len; i < len; i++) {
					
					while (ns.isRunning(trackedThreads[i]){
						
						await ns.asleep(5000)
						
					}
						
					
				}
				
			}
			
		}
		
		while (target.getCurMoney(ns) < (target.maxMoney * 0.95)) {
			
			growThreads = growCount(ns, target, true)
			
			if ((growThreads * 1.75) < homeFreeRam) {
				
				pid = ns.exec("/scripts/grow.js", "home", growThreads, target.hostname))
				
				if (pid > 0) {
					
					weakenThreads = Math.ceil((growThreads * 0.004) / weakenVal)
					pid = ns.exec("/scripts/weaken.js", "home", weakenThreads, target.hostname)
					while (ns.isRunning(pid)) {
					
						await ns.asleep(5000)
					
					}
				}

			} else {
				
				growThreads = growCount(ns, target)
				assignBots(ns, "/scripts/grow.js", target.hostname, growThreads)
				
				weakenThreads = Math.ceil((growThreads * 0.004) / 0.05)
				pid = ns.exec("/scripts/weaken.js", "home", weakenThreads, target.hostname)
				while (ns.isRunning(pid)) {
					
					await ns.asleep(5000)
					
				}
				
				
			}
			
		}
		
		hackThreads = hackCount(ns, target, 30)
		assignBots(ns, "/scripts/hack.js", target.hostname, hackThreads)
		weakenThreads = Math.ceil((hackThreads * 0.002) / weakenVal)
		pid = ns.exec("/scripts/weaken.js", "home", weakenThreads, target.hostname)
		while (ns.isRunning(pid)) {
					
			await ns.asleep(5000)
					
		}
		
		
		await ns.asleep(1000)
		
	}
	
	

}

