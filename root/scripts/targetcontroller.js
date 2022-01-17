/** @param {NS} ns **/

import { hackCount, growCount, weakenCount, assignBots, getServerByName } from "/lib/functions"

export async function main(ns) {

	ns.disableLog("getServerUsedRam")

	var target = getServerByName(ns, ns.args[0], "/data/servers.txt")
	var weakenThreads
	var growThreads
	var hackThreads
	var trackedThreads = []
	var home = getServerByName(ns, "home", "/data/servers.txt")
	var homeRamFree
	var pid
	var weakenVal = ns.weakenAnalyze(1, home.cores)
	while (true) {
		weakenThreads = 0
		growThreads = 0
		hackThreads = 0
		target = getServerByName(ns, target.hostname, "/data/servers.txt")
		home = getServerByName(ns, "home", "/data/servers.txt")
		homeRamFree = home.maxRam - ns.getServerUsedRam(home.hostname) - 500

		while (ns.getServerSecurityLevel(target.hostname) > (target.minSecLevel * 1.05)) {
			weakenThreads = weakenCount(ns, target, true)

			if ((weakenThreads * 1.75) < homeRamFree) {

				pid = ns.exec("/scripts/weaken.js", "home", weakenThreads, target.hostname)

				while (ns.isRunning(pid)) {

					await ns.asleep(5000)

				}

			} else {

				weakenThreads = weakenCount(ns, target)
				trackedThreads = assignBots(ns, "/scripts/weaken.js", target.hostname, weakenThreads)

				for (var i = 0, len = trackedThreads.len; i < len; i++) {

					while (ns.isRunning(trackedThreads[i])) {

						await ns.asleep(5000)

					}


				}

			}

		}

		while (ns.getServerMoneyAvailable(target.hostname) < (target.maxMoney * 0.95)) {

			growThreads = growCount(ns, target, true)

			if ((growThreads * 1.75) < homeRamFree) {

				pid = ns.exec("/scripts/grow.js", "home", growThreads, target.hostname)

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
		if (target.hackLevel < ns.getHackingLevel()) {
			hackThreads = hackCount(ns, target, 50)
			assignBots(ns, "/scripts/hack.js", target.hostname, hackThreads)
			weakenThreads = Math.ceil((hackThreads * 0.002) / weakenVal)
			pid = ns.exec("/scripts/weaken.js", "home", weakenThreads, target.hostname)
			while (ns.isRunning(pid)) {

				await ns.asleep(5000)

			}
		}


		await ns.sleep(1000)

	}



}