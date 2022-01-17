/** @param {NS} ns **/
export async function main(ns) {
	await ns.wget("https://raw.githubusercontent.com/wsebrey/bitburnerscripts/main/root/updatemanifest.txt", "/data/updatemanifest.txt")
	var payload = ns.read("/data/updatemanifest.txt")
	payload = payload.split("\r\n")
	for (let i = 0, len = payload.length; i < len; i++) {
		var status = await ns.wget("https://raw.githubusercontent.com/wsebrey/bitburnerscripts/main/root/" + payload[i], "/" + payload[i])
		ns.tprint(payload[i] + " downloaded: " + status)
	}
}