/** @param {NS} ns **/

import { scanServerData } from "/lib/functions.js"

export async function main(ns) {

	var outPath = ns.args[0] 

	await scanServerData(ns, outPath)
}