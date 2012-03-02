import memcache
mc = memcache.Client(['127.0.0.1:11211'], debug=1)

mc.set("a", "b");
assert mc.get("a") == "b"

mc.set("b", "c")
assert mc.get("b") == "c"
assert mc.get("a") == "b"

mc.set("c", "a c")
assert mc.get("c") == "a c"
