key_heap = require('./heap')
CRLF = "\r\n"

cache =
	storage: {}
	settings: {}

	init: (settings) ->
		for k of (settings or { })
			@settings[k] = settings[k]
		@settings.max_memory *= 1024*1024	

	get: (key) ->
		if @storage[key] 
			if @storage[key].exptime == 0 or @storage[key].exptime >= Date.now()
				return "VALUE " + key + " " + @storage[key].flags + " " + @storage[key].size + CRLF + @storage[key].value + CRLF + "END"
			else
				console.info "EXPIRED!" + @storage[key].exptime
				delete @storage[key]
		"END"

	clearCache: ->
		storage: {}
		key_heap.clear()

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
			exptime: @calcExpTime(exptime)
			size: size
			value: data

		#TODO check what to do with rewrite of an pre-existent key
		#TODO make key_heap operations async
		key_heap.insert(key, @storage[key].exptime)
		while process.memoryUsage().rss > @settings.max_memory
			console.info "memory limit reached, cleaning"
			delete @storage[key_heap.extract()]
		"STORED"

	calcExpTime: (exptime) ->
		if exptime == 0
			exptime = Number.POSITIVE_INFINITY
		else if exptime <= 2592000  # 60*60*24*30, max time for relative exptime
			exptime += Date.now()
		exptime

	delete: (command) ->
		params = command.split(' ')
		key = params[0]
		if @storage[key]
			delete @storage[key]
			return "DELETED"
		"NOT_FOUND"
	
	dump: ->
		console.info @storage

	dispatch: (cmd) ->
		cmd = cmd.toString()
		firstSpace = cmd.indexOf(" ")
		command = (if firstSpace isnt -1 then cmd.substring(0, firstSpace) else cmd.trim())
		if @hasOwnProperty(command) and typeof this[command] == 'function'
			this[command].call(this, cmd.substring(firstSpace).trim()) + CRLF
		else
			"ERROR" + CRLF

module.exports = cache
