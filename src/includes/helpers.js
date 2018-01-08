/**
 * Living Lab server-side helper functions
 *
 */

var os = require('os');


/**
 * Get IP Address that we are running on.
 *
 */
exports.getIPAddress = function(idx) {

	var addresses = [],
		interfaces = os.networkInterfaces(),
		name,
		ifaces,
		iface;

	for (name in interfaces) {
		if(interfaces.hasOwnProperty(name)){
			ifaces = interfaces[name];
			if(!/(loopback|vmware|internal)/gi.test(name)){
				for (var i = 0; i < ifaces.length; i++) {
					iface = ifaces[i];
					if (iface.family === 'IPv4' &&  !iface.internal && iface.address !== '127.0.0.1') {
						addresses.push(iface.address);
					}
				}
			}
		}
	}

	// if an index is passed only return it.
	if (idx >= 0) {
		return addresses[idx];
	}

	return addresses;
}
