/** @param {NS} ns **/

export class RefServer {
	
	/* 	Object to hold static/semi-static server information 
		to reduce number of data calls and eliminate getServer in main loop*/
		
	hostname
	maxRam
	curRam
	hackLevel
	minSecLevel
	curSecLevel
	maxMoney
	curMoney
	openPortsRequired
	root = false
	player = false // will be set by scanServerData
	cores = 1 // will be updated for home by scanServerData
	
	constructor(ns, hostname) {
		//Initialize object with static/semi-static information
		this.hostname = hostname
		this.maxRam = ns.getServerMaxRam(hostname)
		this.growth = ns.getServerGrowth(hostname)
		this.hackLevel = ns.getServerRequiredHackingLevel(hostname)
		this.minSecLevel = ns.getServerMinSecurityLevel(hostname)
		this.maxMoney = ns.getServerMaxMoney(hostname)
		this.openPortsRequired = ns.getServerNumPortsRequired(hostname)
		this.root = ns.hasRootAccess(hostname) //Will be static once all hacking programs are available
		
	}
	//Methods to provide convenient method to return dynamic information 
	getCurSecLevel(ns) {
		
		return ns.getServerSecurityLevel(this.hostname)
		
	}
	
	getCurMoney(ns) {
		
		return ns.getServerMoneyAvailable(this.hostname)
		
	}
	
	getFreeRam(ns) {
		
		return (this.maxRam - ns.getServerUsedRam(this.hostname))
		
	}

}