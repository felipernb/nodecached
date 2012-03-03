var CRLF = "\r\n";
var cache = {
	
	storage : {},

	get : function(key) {
		var value = "";
		if (this.storage[key]) {
			value = "VALUE " + key + " " + this.storage[key]['flags'] + " " + this.storage[key]['size'] + "\r\n"+this.storage[key]['value'] + CRLF;
		}
		return value + "END";
	},

	set : function(command) {
		var separator = command.indexOf(CRLF);
		var params = command.substring(0, separator).trim().split(' ');
		
		var key = params[0];
		var flags = params[1];
		var exptime = params[2];
		var size = params[3];
		
		var data = command.substring(separator).trim();
		
		
		if (size && data && data.length != size) {
			console.info(command);
			return "CLIENT_ERROR Wrong size expecting: "+size+"  received:" + data.length;
		}

		this.storage[key] = { 'flags': flags, 'exptime': exptime, 'size': size, 'value': data};
		
		return "STORED";
	},



	dispatch : function(cmd) {
		cmd = cmd.toString();
		var firstSpace = cmd.indexOf(' ');
		var command = cmd.substring(0,firstSpace);
		if (this.hasOwnProperty(command)) {
			return this[command].call(this, cmd.substring(firstSpace).trim()) + CRLF;
		} else {
			return "ERROR" + CRLF;
		}
	}


};

module.exports = cache;
