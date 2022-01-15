/** @param {NS} ns **/

import { getRoot, getRootedServers } from "/lib/functions.js"

export async function main(ns) {

	var target = ns.args[0]
	var useHome = ns.args[1]
	var servers = getRootedServers(ns, "/data/servers.txt")
	var servcount = 0
	var threadcount = 0

	if (ns.hasRootAccess(target) == false) {
		getRoot(ns, target)
	}

	if (ns.hasRootAccess(target)) {

		for (var i in servers) {

			if (ns.fileExists("/scripts/basichack.js", servers[i]) == false) {
				await ns.scp("/scripts/basichack.js", servers[i])
			}

			var maxThreads = ns.getServerMaxRam(servers[i]) / ns.getScriptRam("/scripts/basichack.js", servers[i])
			maxThreads = Math.trunc(maxThreads)

			if (maxThreads > 0) {
				if (ns.isRunning("/scripts/basichack.js", servers[i], target) == false) {
					ns.scriptKill("/scripts/basichack.js", servers[i])
					ns.exec("/scripts/basichack.js", servers[i], maxThreads, target)
				}
			}

			servcount++
			threadcount += maxThreads

		}

		if (useHome != false) {

			var availRAM = ns.getServerMaxRam("home") - 91.8

			var homeThreads = availRAM / ns.getScriptRam("/scripts/basichack.js")
			homeThreads = Math.trunc(homeThreads)


			if (ns.isRunning("/scripts/basichack.js", "home", target) == false) {
				ns.scriptKill("/scripts/basichack.js", "home")

				ns.run("/scripts/basichack.js", homeThreads, target)
			}

			servcount++
			threadcount += homeThreads
		}

		ns.tprint("Mass Hack of " + target + " has commenced. " + servcount + " servers now targeting " + target + " with " + threadcount + " threads.")
	}
	else {
		ns.tprint("Invalid Target, unable to get Root Access to " + target)
	}
}