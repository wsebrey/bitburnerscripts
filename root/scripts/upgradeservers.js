/** @param {NS} ns **/
export async function main(ns) {

	var ram = ns.args[0]
	var maxram = ns.args[1]
	var servers = ns.getPurchasedServers()

	for (var i = 0, len = (servers.length); i < len; i++) {

		while (ns.getServerMaxRam(servers[i]) < ram) {

			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				ns.killall(servers[i])
				ns.deleteServer(servers[i])
				var hostname = ns.purchaseServer(servers[i], ram)
				ns.tprint("Upgraded " + hostname + " to " + ram + "GBs of RAM.")
			}
			await ns.asleep(1000)
		}
	}
	if (ram < maxram) {
		ns.tprint("All servers upgraded to " + ram + " GBs of RAM. Moving to " + (ram * 2) + "GBs of RAM")
		ns.spawn("/scripts/upgradeservers.js", 1, (ram * 2), maxram)		
	} else {
		ns.tprint("All servers upgraded to " + ram + " GBs of RAM. Execution stopping")
	}
}