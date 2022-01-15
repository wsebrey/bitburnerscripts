/** @param {NS} ns **/
export async function main(ns) {
	// Set RAM amount
	var ram = ns.args[0]
	var maxram = ns.args[1]
	var prefix = ns.args[2]
	var i = ns.getPurchasedServers().length
	while (i < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			var hostname = ns.purchaseServer(prefix + i, ram)
			i++
			await ns.scp("/scripts/basichack.js", hostname)
			ns.tprint("Purchased " + hostname + ". " + i + "servers owned.")
		}
		await ns.sleep(1000)
	}
	ns.spawn("/scripts/upgradeservers.js", 1, (ram * 2), maxram)
}