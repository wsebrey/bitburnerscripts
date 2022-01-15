/** @param {NS} ns **/

export function getRoot(ns, tarHostname) {

	/* Opens all possible ports on hostname that is passed into the function, 
	then runs nuke to get root if the number of open ports is now sufficient*/

	//run hacking utilities if present

	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(tarHostname)
	}

	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(tarHostname)
	}

	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(tarHostname)
	}

	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(tarHostname)
	}

	if (ns.fileExists("SQLInject.exe", "home")) {
		ns.sqlinject(tarHostname)
	}

	//get server object after ports opened
	var tarObj = ns.getServer(tarHostname)
	//check open ports, get root if able
	if (tarObj.openPortCount >= tarObj.numOpenPortsRequired) {
		ns.nuke(tarHostname)
	}
	//return true if root access attempt was successful, false otherwise
	if (ns.hasRootAccess(tarHostname)) {
		return true
	}
	else {
		return false
	}
}

export async function scanServerData(ns, path = "/data/servers.txt") {

	//TODO - CONVERT TO USE ARRAY.JOIN() - readServerData will need to be updated to conform
	//TODO - CONVERT TO USE FILTERS?
	/* Scan all servers, add names to servList if not yet present,
	then write hostnames, 1 per line, to specified file. Default path is /data/servers.txt */

	var servList = []	//List of unique hostnames

	servList = ns.scan() //scan host script is running on to start

	// iterate through the list of servers, dynamically extending loop as new hostnames are added
	for (let x = 0; x < servList.length; x++) {
		//scan each hostname in turn
		var latestScan = ns.scan(servList[x])
		//iterate through hostnames returned from latest scan
		for (let y = 0; y < latestScan.length; y++) {
			//if hostname is not present in servList, add it to the end of the array
			if (servList.includes(latestScan[y]) == false) {
				servList.push(latestScan[y])
			}
		}
	}
	//clear file if it exists
	ns.clear(path)
	//iterate through list of servers, write hostname to file, then write newline character
	for (let i in servList) {
		await ns.write(path, servList[i], "a")
		await ns.write(path, "\n", "a")
	}
	//final file is one hostname per line with an empty line at the end

}

export function readServerData(ns, path = "/data/servers.txt") {
	/* read file of server names, split at newline characters, remove last empty entry, 
	return array of server objects */
	var servers = ns.read(path)

	servers = servers.split("\n")
	servers.pop()

	for (var i = 0; i < servers.length; i++) {

		servers[i] = ns.getServer(servers[i])
	}

	return servers
}

export function getRootedServers(ns, path = "/data/servers.txt") {
	//TODO - FILTER?
	
	/* 	gets server objects from readServerData, adds all servers that you have root on to
		a new array and returns that array*/
	var allServers = readServerData(ns, path)
	var roots = []

	for (let i = 0, len = allServers.length; i < len; i++) {
		if (allServers[i].hasAdminRights) {
			roots.push(allServers[i])
		}
	}
	return roots
}

export function getHackableServers(ns, path = "/data/servers.txt") {
	/* 	gets server objects from readServerData, sorts array in ascending order by required 
		hacking skill, then reverses the array and returns it sorted in descending order*/
	var servers = getRootedServers(ns, path)
	// create array of player servers
	var excludes = ns.getPurchasedServers()
	excludes.push("home")
	//get player hacking skill
	var hackSkill = ns.getHackingLevel()
	//filter array for player owned servers
	servers = servers.filter(server => (excludes.includes(server.hostname) == false))
	//filter array for servers that are hackable at current skill
	servers = servers.filter(server => (server.requiredHackingSkill < hackSkill))
	//sort servers in order of descending hacking skill
	servers.sort(function (a, b) { return b.requiredHackingSkill - a.requiredHackingSkill })

	return servers //returns array of servers that are hackable at current skill, in descending order

}

export function getUsableServers(ns, path = "data/servers.txt") {
	/* TODO - FILTER? */
	var rootedServers = getRootedServers(ns, path)
	var usableServers = []

	for (var i = 0, len = rootedServers.length; i < len; i++) {

		if (rootedServers[i].maxRam > 0) {

			usableServers.push(rootedServers[i])

		}

	}

	return usableServers

}

export function weakenCount(ns, target, home = false) {
	
	var threads
	
	
	if (home) {
		
		var w1 = ns.weakenAnalyze(1, ns.getServer("home").cpuCores)
		threads = Math.ceil((target.hackDifficulty - target.minDifficulty) / w1)
		
	} else {
		
		threads = Math.ceil((target.hackDifficulty - target.minDifficulty) / 0.05)
		
	}
	
	return threads
	
}

export function growCount(ns, target, home = false) {
	
	var threads
	var tarServer = ns.getServer(target)
	var growMult
	
	growMult = tarServer.moneyMax / tarServer.moneyAvailable
	
	if (home) {
		
		threads = Math.ceil(ns.growthAnalyze(target, growMult, ns.getServer("home").cpuCores))
		
	} else {
		
		threads = Math.ceil(ns.growthAnalyze(target, growMult))
		
	}
	
	return threads
	
}

export function hackCount(ns, target, percent = 50) {
	
	var h1 = ns.hackAnalyze(target) * 100
	var threads = Math.floor(percent / h1)
	
	return threads
	
}























