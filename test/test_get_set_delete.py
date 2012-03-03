import memcache
import sys
import os
import random
import string

mc = memcache.Client(['127.0.0.1:11211'], debug=1)

x = { }

for i in xrange(1,1000):	
	x[''.join(random.choice(string.digits+string.letters ) for x in range(random.randint(2,32)))] = ''.join(random.choice(string.printable) for x in range(random.randint(2,255))).strip()

for k,v in x.iteritems():
	mc.set(k, v)

for k, v in x.iteritems():
	result = mc.get(k)
	if result != v:
		print "Expected: %s - Received: %s" % (v, result)
		sys.exit()
	
	sys.stdout.write(".")

for k, v in x.iteritems():
	mc.delete(k)
	if mc.get(k):
		print "Expected %s to be deleted" % k
		sys.exit()
	
	sys.stdout.write(".")





print ""
