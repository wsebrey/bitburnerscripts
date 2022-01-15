/** @param {NS} ns **/
import { getRoot } from "/lib/functions.js";

export async function main(ns) {
	var target = ns.args[0]
	if (getRoot(ns, target)) {
		ns.tprintf("Root achieved on %s", target)
	} else {
		ns.tprintf("Unable to gain Root on %s. Please try again later.", target)
	}
}