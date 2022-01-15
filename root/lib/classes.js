/** @param {NS} ns **/

export class RefServer {

	constructor(ns, hostname) {

		server = ns.getServer(hostname)

		this.hostname = hostname
		this.ram = server.maxRam
		this.growth = server.serverGrowth
		this.hackLevel = server.requiredHackingSkill
		this.security = server.hackDifficulty
		this.minSecurity = server.minDifficulty
		this.usedRam = server.ramUsed
		this.maxMoney = server.moneyMax
		this.curMoney = server.moneyAvailable
		this.curTarget
		this.freeRAM = this.ram - this.usedRam
		this.openPortsRequired = server.numOpenPortsRequired
		this.root = server.hasAdminRights

	}

}