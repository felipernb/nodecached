var CRLF = "\r\n";
var cache = {
	
	storage : {},

	get : function(key) {
		key = key.trim();
		var value = "";
		if (this.storage[key]) {
			value += "VALUE " + key + " " + this.storage[key]['flags'] + " " + this.storage[key]['size'] + "\r\n"+this.storage[key]['value'] + CRLF;
		}
		return value + "END";
	},

	set : function() {
		console.info("SET", arguments);
		
		var args = Array.prototype.slice.call(arguments);
		var key = args.shift();
		var flags = args.shift();
		var exptime = args.shift();
		var value = args.join(' ');

		var re = /(\d+)\r\n(.*)\r\n$/
		var match = re.exec(value);
		
		var size = match[1];
		value = match[2];
		
		if (value.length != size) return "CLIENT_ERROR Wrong specified size";
		
		this.storage[key] = { 'flags': flags, 'exptime': exptime, 'size': size, 'value': value};
		
		return "STORED";
	},



	dispatch : function(cmd) {
		var params = cmd.toString().split(' ');
		var command = params.shift();
		if (this.hasOwnProperty(command)) {
			return this[command].apply(this, params) + CRLF;
		} else {
			return "ERROR" + CRLF;
		}
	}


};

module.exports = cache;
