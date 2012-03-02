import memcache
import sys

mc = memcache.Client(['127.0.0.1:11211'], debug=1)

x = { "a" : "b",
	  "b" : "c",
	  "c" : "c d",
	  "d" : "e\nf a"}

for k,v in x.iteritems():
	mc.set(k, v)

for k, v in x.iteritems():
	assert mc.get(k) == v
	sys.stdout.write(".")
print ""
