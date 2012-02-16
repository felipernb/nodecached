var cache = {
	
	storage : {},
	
	get : function(key) {
		key = key.trim();
		var value = "";
		if (this.storage[key]) {
			value += this.storage[key] + "\r\n";
		}
		return value + "END";
	},

	set : function(key, value) {
		this.storage[key.trim()] = value.trim();
		return "STORED";
	},



	dispatch : function(cmd) {
		var params = cmd.toString().split(' ');
		var command = params.shift();
		if (this.hasOwnProperty(command)) {
			return this[command].apply(this, params) + "\r\n";
		} else {
			return "ERROR\r\n";
		}
	}


};

module.exports = cache;
