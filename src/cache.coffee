CRLF = "\r\n"

cache =
	storage: {}
	
	get: (key) ->
		if @storage[key]
			return "VALUE " + key + " " + @storage[key]["flags"] + " " + @storage[key]["size"] + "\r\n" + @storage[key]["value"] + CRLF	+ "END"
		"END"

	set: (command) ->
		separator = command.indexOf(CRLF)
		params = command.substring(0, separator).trim().split(" ")
		
		key = params[0]
		flags = params[1]
		exptime = (Number) params[2]
		size = (Number) params[3]
		
		data = command.substring(separator).trim()
		
		if size and data and data.length isnt size
			console.info command
			return "CLIENT_ERROR Wrong size expecting: " + size + "	received:" + data.length
		
		@storage[key] =
			flags: flags
			exptime: exptime
			size: size
			value: data

		"STORED"

	delete: (command) ->
		params = command.split(' ')
		key = params[0]
		if @storage[key]
			delete @storage[key]
			return "DELETED"
		else
			return "NOT_FOUND"
	
	dump: ->
		console.info @storage

	dispatch: (cmd) ->
		cmd = cmd.toString()
		firstSpace = cmd.indexOf(" ")
		command = (if firstSpace isnt -1 then cmd.substring(0, firstSpace) else cmd.trim())
		if @hasOwnProperty(command)
			this[command].call(this, cmd.substring(firstSpace).trim()) + CRLF
		else
			"ERROR" + CRLF

module.exports = cache
