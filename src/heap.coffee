
heap = {
	elements: []
	n: 0

	'''
	Insert a value to the heap, keeping the heap property
	'''
	insert: (key, timestamp) ->
		@elements[++@n] = {'key':key, 'timestamp': timestamp}
		i = @n
		while i > 1 and @elements[i >> 1].timestamp > @elements[i].timestamp
			child = i >> 1
			@swap(child, i)
			i = child

	isEmpty: ->
		@n == 0

	'''
	Rearranges the heap after an extraction to keep the heap property
	'''
	siftDown: ->
		i = 1
		while i * 2 <= @n
			c = i * 2
			# Checks which is the smallest child to compare to the parent
			if c+1 < @n and @elements[c+1].timestamp < @elements[c].timestamp
				c++
			if @elements[i].timestamp < @elements[c].timestamp
				#the smallest child is bigger than the parent
				break
			@swap(c, i)
			i = c

	'''
	Extracts the top of the heap
	'''
	extract: ->
		if @isEmpty()
			return null
		e = @elements[1]
		last = @elements.pop()
		@n--
		if @elements[1] #If haven't reached the last element
			@elements[1] = last
			@siftDown()
		
		e.key

	clear: ->
		@elements = []
		@n = 0
	
	swap: (a, b) ->
		tmp = @elements[a]
		@elements[a] = @elements[b]
		@elements[b] = tmp

}

module.exports = heap
