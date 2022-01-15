/** @param {NS} ns **/
export async function main(ns) {
	ns.tprint("Weaken")
	var w1
	var w2
	var wdif

	for (i = 1; i < 10; i++) {
		w1 = ns.weakenAnalyze(5, i)
		w2 = ns.weakenAnalyze(5, (i + 1))
		wdif = ((w2 - w1) / Math.abs(w1)) * 100
		ns.tprint(i + 1)
		ns.tprint(wdif + "%")
	}

	ns.tprint("Grow")

	var g1
	var g2
	var gdif

	for (var i = 1; i < 10; i++) {
		g1 = ns.growthAnalyze("n00dles", 2, i)
		g2 = ns.growthAnalyze("n00dles", 2, (i + 1))
		gdif = ((g1 - g2) / Math.abs(g1)) * 100
		ns.tprint(i + 1)
		ns.tprint(gdif + "%")

	}

}