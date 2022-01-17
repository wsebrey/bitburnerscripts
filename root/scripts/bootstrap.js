/** @param {NS} ns **/
export async function main(ns) {

	ns.run("/scripts/webcrawl.js")
	ns.run("/scripts/buyservers.js", 1, 8, 2048)
	ns.run("/scripts/hacktheplanet.js")
	ns.run("/scripts/masshack.js")

}