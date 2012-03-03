(function() {
  var cache, net, server;

  net = require("net");

  cache = require("./cache");

  server = net.createServer(function(c) {
    console.log("client connected");
    c.on("data", function(data) {
      return c.write(cache.dispatch(data));
    });
    return c.on("end", function() {
      return console.log("client disconnected");
    });
  });

  server.listen(11211, function() {
    return console.log("server bound");
  });

}).call(this);
