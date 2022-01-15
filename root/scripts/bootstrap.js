/** @param {NS} ns **/
export async function main(ns) {

	ns.run("/scripts/webcrawl.js")
	ns.run("/scripts/BuyServers.js", 1, 8, 2048)
	ns.run("/scripts/HackThePlanet.js")
	ns.run("/scripts/MassHack.js", 1, "n00dles")

}