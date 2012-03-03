(function() {
  var CRLF, cache;

  CRLF = "\r\n";

  cache = {
    storage: {},
    get: function(key) {
      var value;
      value = "";
      if (this.storage[key]) {
        value = "VALUE " + key + " " + this.storage[key]["flags"] + " " + this.storage[key]["size"] + "\r\n" + this.storage[key]["value"] + CRLF;
      }
      return value + "END";
    },
    set: function(command) {
      var data, exptime, flags, key, params, separator, size;
      separator = command.indexOf(CRLF);
      params = command.substring(0, separator).trim().split(" ");
      key = params[0];
      flags = params[1];
      exptime = Number(params[2]);
      size = Number(params[3]);
      data = command.substring(separator).trim();
      if (size && data && data.length !== size) {
        console.info(command);
        return "CLIENT_ERROR Wrong size expecting: " + size + "	received:" + data.length;
      }
      this.storage[key] = {
        flags: flags,
        exptime: exptime,
        size: size,
        value: data
      };
      return "STORED";
    },
    dump: function() {
      return console.info(this.storage);
    },
    dispatch: function(cmd) {
      var command, firstSpace;
      cmd = cmd.toString();
      firstSpace = cmd.indexOf(" ");
      command = (firstSpace !== -1 ? cmd.substring(0, firstSpace) : cmd.trim());
      if (this.hasOwnProperty(command)) {
        return this[command].call(this, cmd.substring(firstSpace).trim()) + CRLF;
      } else {
        return "ERROR" + CRLF;
      }
    }
  };

  module.exports = cache;

}).call(this);
