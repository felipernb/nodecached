var net = require('net');
var cache = require('./cache.js');
var server = net.createServer(function(c) { //'connection' listener
	console.log('client connected');

	c.on('data', function(data) {
		c.write(cache.dispatch(data));
	});

	c.on('end', function() {
		console.log('client disconnected');
	});
	
});
server.listen(11211, function() { //'listening' listener
  console.log('server bound');
});
