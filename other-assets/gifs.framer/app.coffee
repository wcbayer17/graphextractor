# Define and set custom device
Framer.Device.customize
	deviceType: Framer.Device.Type.Tablet
	devicePixelRatio: 1
	screenWidth: (244)
	screenHeight: (149)

bg.x = 0
bg.y = 10

maxY.draggable.enabled = true
maxY.draggable.horizontal = false

minYX.draggable.enabled = true
minYX.draggable.horizontal = false

inputMaxY.onClick ->
	inputMaxY.color = 'black'
	
inputMinY.onClick ->
	inputMinY.color = 'black'
	
bg.on Events.Tap, (event) ->
	tapInfo = event.contextPoint
	tapX = event.pageX
	tapY = event.pageY
	newX = x.copy()
	newX.parent = bg
	newX.midX = tapInfo.x
	newX.midY = tapInfo.y - 10
	
	