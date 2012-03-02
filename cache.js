var CRLF = "\r\n";
var cache = {
	
	storage : {},

	get : function(key) {
		key = key.trim();
		var value = "";
		if (this.storage[key]) {
			value = "VALUE " + key + " " + this.storage[key]['flags'] + " " + this.storage[key]['size'] + "\r\n"+this.storage[key]['value'] + CRLF;
		}
		return value + "END";
	},

	set : function() {
		
		var args = Array.prototype.slice.call(arguments);
		var key = args.shift();
		var flags = args.shift();
		var exptime = args.shift();
		var value = args.join(' ');

		var split = value.indexOf(CRLF);	
		var size = value.substring(0, split);
		value = value.substring(split).trim();
		
		if (value.length != size) return "CLIENT_ERROR Wrong specified size, passed: "+ size + "and it was really: "+value.length;
		
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
