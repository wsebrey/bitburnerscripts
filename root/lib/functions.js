/** @param {NS} ns **/

import {RefServer} from "lib/classes.js"

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
	
	/* 	Scan all servers, add names to servList if not yet present.
		Convert the hostnames into RefServer objects, write to path using JSON.stringify*/

	var servList = []	//List of unique hostnames
	var playerServers = ns.getPurchasedServers().push("home") //contains hostnames of purchased servers and home
	var servers = []	//Will hold final RefServers
	var writeData 		//Will hold final data to write to file
	servList = ns.scan() //scan host script is running on to start

	// iterate through the list of servers, dynamically extending loop as new hostnames are added
	for (let i = 0; i < servList.length; i++) {
		//scan each hostname in turn
		var latestScan = ns.scan(servList[i])
		//filter scan result for names already in the list
		latestScan = latestScan.filter(server => servList.includes(server) == false)
		//merge the new hostnames into servList
		servList.concat(latestScan)
		
	}
	// servList now contains all hostnames, iterate through array to create RefServer objects
	for (let i = 0, len = servList.length; i < len; i++) {
		// create RefServer object for hostname
		var newServ = new RefServer(ns, servList[i])
		// check if home or purchased server, set player flag if true
		if (playerServers.includes(newServ.hostname)) {
			newServ.player = true
		}		
		//update number of cores if home
		if (newServ.hostname == "home") {
			newServ.cores = ns.getServer("home").cpuCores
		}
		//add to servers array
		servers.push(newServ)
	}
	//sort by required hack level by default
	servers.sort(function (a, b) { return b.hackLevel - a.hackLevel })
	//stringify servers array
	writeData = JSON.stringify(servers)
	//write stringified array to path, overwriting if file exists
	await ns.write(path, writeData, "w")
	
}

export function readServerData(ns, path = "/data/servers.txt") {

	//read path, use JSON.parse to convert back to RefServer array, return data
	var servers = JSON.parse(ns.read(path))
	return servers
	
}

export function getRootedServers(ns, path = "/data/servers.txt") {
	/* 	Get RefServer objects from readServerData,
		filter for servers with root*/
	//Get server data from readServerData
	var roots = readServerData(ns, path)
	//filter servers for root access
	roots = roots.filter(server => server.root)
	//return array of server objects
	return roots
	
}

export function getHackableServers(ns, path = "/data/servers.txt") {
	/* 	Gets rooted servers from getRootedServers, then filters out player servers 
		and servers that exceed current hack level */
	//get rooted servers from getRootedServers
	var servers = getRootedServers(ns, path)
	//get player hacking skill
	var hackSkill = ns.getHackingLevel()
	//filter array to remove player owned servers
	servers = servers.filter(server => (server.player == false))
	//filter array for servers that are hackable at current skill
	servers = servers.filter(server => (server.hackLevel < hackSkill))
	//return servers
	return servers

}

export function getUsableServers(ns, path = "/data/servers.txt") {
	/*	Provides list of serves that can be used to run scripts.
		Gets rooted servers from getRootedServers, filters for servers with 0 RAM,
		then sorts by maxRam in ascending order */
	//get rooted servers
	var servers = getRootedServers(ns, path)
	//filter to remove servers with 0 RAM
	servers = servers.filter(server => server.maxRam > 0)
	//sort by max RAM in ascending order
	servers.sort(function (a, b) {return a.maxRam - b.maxRam})
	//return sorted list
	return servers

}

export function getServerByName(ns, hostname, path = "/data/servers.txt") {
	
	return readServerData(ns, path).find(server => server.hostname = hostname)
	
}

export function weakenCount(ns, target, home = false) {
	/*	Calculates number of threads required to reduce target server to minimum security.
		Flag available to calculate threads based on number of cores on home*/
		var threads 
	// if home flag is set, calculate for running on home
	if (home) {
		//get home refServer from getUsableServers
		var homeServ = getUsableServers(ns).find(server => server.hostname = "home")
		//calculate weaken value of one thread
		var w1 = ns.weakenAnalyze(1, homeServ.cores)
		//determine number of threads to reduce target to the minimum security level
		threads = Math.ceil((target.getCurSecLevel(ns) - target.minSecLevel) / w1)
		
	} else {
		//determine required threads using base weaken value
		threads = Math.ceil((target.getCurSecLevel(ns) - target.minSecLevel) / 0.05)
		
	}
	
	return threads
	
}

export function growCount(ns, target, home = false) {
	
	var threads
	var growMult
	//get home refServer from getUsableServers
	var homeServ = getHome(ns)
	//determine how much money needs to grow to hit maximum
	growMult = target.maxMoney / target.getCurMoney(ns)
	
	if (home) {
		
		threads = Math.ceil(ns.growthAnalyze(target, growMult, homeServ.cores))
		
	} else {
		
		threads = Math.ceil(ns.growthAnalyze(target, growMult))
		
	}
	
	return threads
	
}

export function hackCount(ns, target, percent = 30) {
	
	var h1 = ns.hackAnalyze(target.hostname) * 100
	var threads = Math.floor(percent / h1)
	
	return threads
	
}

export function assignBots(ns, script, target, threads) {
	/* 	Assign threads to usable servers and return the information of the
		started scripts*/
	//get servers that can run scripts
	var bots = getUsableServers(ns)
	var processInfo = [] // will hold process info to be returned
	//get script ram
	var scriptRam = ns.getScriptRam(script)
	//remove home from bots (this is used to assign to non home hosts)
	bots = bots.filter(bot => (bot.hostname != "home"))
	//start at top of list (least ram)
	for (var i = 0, len = bots.length; i < len) {
		// figure out how many threads the host can run
		var botThreads = Math.floor(bots[i].getFreeRam(ns) / scriptRam)
		//if the number of threads the host can run is more than the amount requested, make it the amount requested
		if (botThreads > threads) {
			
			botThreads = threads
			
		}
		//if more threads are needed
		if (botThreads > 0) {
			
			
			//run script on host
			var pid = ns.exec(script, bots[i].hostname, botThreads, target)
			
			if (pid > 0) {
			//decrement threads based on number of threads started
			threads -= botThreds
			//add script details to the return value for tracking by calling script
			processInfo.push([script, bots[i].hostname, botThreads, target)
			}
			
		}
		//if no more threads are required, break loop
		if (threads = 0) {
			
			break
			
		}
	}
	//return process info
	return processInfo
	
}






















