// Global Variables

	// Need an object with keys (Y series, X series, user data - in this case the chart, graph data variables)
	const graphData = {
		appImageFile: "",
		xInterval: 0,
		xMin: 0,
		yMax: {
			value: 0,
			coordinate: 0,
		},
		yXAxis: {
			value: 0,
			coordinate: 0,
		},
		ySeriesCoordinates: [[]],
		xSeriesCoordinates: [],
		state: {
			hasUploadedGraph: false,
			hasSetXInterval: false,
			hasSetMaxY: false,
			hasSubmittedMaxY: false,
			hasClickedXAxis: false,
			hasSubmittedXAxis: false,
			hasClickedDataPoints: false,
		}
	};

// Document Elements
	const accordion = document.querySelector("#accordion");
	const sidePanelUploadButton = document.querySelector("#sidePanelUploadButton");
	const appImage = document.querySelector("#appImage");
	const instructionText = document.querySelector(".instructionText")
	
	// buttons
	const buttonDemoGraph = document.querySelector("#buttonDemoGraph");
	const buttonHeadingOne = document.querySelector("#headingOne button");
	const buttonHeadingTwo = document.querySelector("#headingTwo button");
	const buttonHeadingThree = document.querySelector("#headingThree button");
	const buttonHeadingFour = document.querySelector("#headingFour button");
	const buttonHeadingFive = document.querySelector("#headingFive button");
	const buttonSubmitSetXInterval = document.querySelector("#buttonSubmitSetXInterval");
	const buttonSubmitSetMaxY = document.querySelector("#buttonSubmitSetMaxY");
	const buttonSubmitSetYXAxis = document.querySelector("#buttonSubmitSetYXAxis");
	const buttonCsvExport = document.querySelector("#buttonCsvExport");

	// forms
	const formStep2SetXInterval = document.querySelector("#step2SetXInterval");
	const formStep2SetMinX = document.querySelector("#step2SetMinX");
	const formStep3SetMaxYValue = document.querySelector("#step3SetMaxYValue");
	const formStep4SetYValue = document.querySelector("#step4SetYValue");

// Utils
	// Step Router
	const clickNextStep = (header) => {
		header.click();
	}


	// Horizontal Line Creator
	const createHorizontalLineDiv = (y) => {
		const line = document.createElement("div");
		line.className = "horizontalLine";
		line.style.top = y;
		appImage.appendChild(line);
	}
	
	// Dot Creator
	const createDot = (y, x) => {
		const dot = document.createElement("div");
		dot.className = "dot";
		dot.innerHTML = "&#10060";
		dot.style.top = y - 12;
		dot.style.left = x - 14;
		appImage.appendChild(dot);
	}

// Step 1 - DemoImage: Get image from user and put in object
const getDemoImage = () => {
	appImage.style.backgroundImage = `url("./img/graphDemoChart.png")`;
	accordion.classList.remove("isInactive");
	instructionText.classList.remove("isInactive");
	buttonDemoGraph.classList.add("isInactive");
	graphData.state.hasUploadedGraph = true;
	clickNextStep(buttonHeadingTwo);
}

	// Event Listener for Graph Upload
	buttonDemoGraph.addEventListener("click", getDemoImage, true);


// Step 1: Get image from user and put in object
const getImage = () => {
	graphData.appImageFile = sidePanelUploadButton.files[0];
	const graphFileReader = new FileReader;
	graphFileReader.onloadend = () => {
		appImage.style.backgroundImage = `url( ${graphFileReader.result} )`;
	}

	if (graphData.appImageFile) {
		graphFileReader.readAsDataURL(graphData.appImageFile);
	} else {	}
	accordion.classList.remove("isInactive");
	instructionText.classList.remove("isInactive");
	buttonDemoGraph.classList.add("isInactive");
	graphData.state.hasUploadedGraph = true;
	clickNextStep(buttonHeadingTwo);
}

	// Event Listener for Graph Upload
	sidePanelUploadButton.addEventListener("change", getImage, true);


// Step 2: Get X data from user and put in object
const setXInterval = () => {
	graphData.xInterval = formStep2SetXInterval.value;
	graphData.xMin = formStep2SetMinX.value;
}

buttonSubmitSetXInterval.addEventListener("click", (event) => {
	event.preventDefault();
	setXInterval();
	graphData.state.hasSetXInterval = true;
	clickNextStep(buttonHeadingThree);
	}
);

// Step 3: Get Max Y data from user and put in object
appImage.addEventListener("click", (event) => {
	if (graphData.state.hasSetXInterval === true && graphData.state.hasSetMaxY === false) {
		let yParameter = event.offsetY;
		let xParameter = event.offsetX;
		graphData.yMax.coordinate = yParameter;
		createHorizontalLineDiv(yParameter);
		formStep3SetMaxYValue.disabled = false;
		buttonSubmitSetMaxY.disabled = false;
		graphData.state.hasSetMaxY = true;
	} else { }
})

const setMaxY = () => {
	graphData.yMax.value = formStep3SetMaxYValue.value;
}

buttonSubmitSetMaxY.addEventListener("click", (event) => {
	event.preventDefault();
	setMaxY();
	clickNextStep(buttonHeadingFour);
	graphData.state.hasSubmittedMaxY = true;
	}
);

// Step 4: Get X Axis Y value from user and put in object
appImage.addEventListener("click", (event) => {
	if (graphData.state.hasSubmittedMaxY === true && graphData.state.hasClickedXAxis === false) {
		let yParameter = event.offsetY;
		let xParameter = event.offsetX;
		graphData.yXAxis.coordinate = yParameter;
		createHorizontalLineDiv(yParameter);
		formStep4SetYValue.disabled = false;
		buttonSubmitSetYXAxis.disabled = false;
		graphData.state.hasClickedXAxis = true;
	} else { }
})

const setYXAxis = () => {
	graphData.yXAxis.value = formStep4SetYValue.value;
}

buttonSubmitSetYXAxis.addEventListener("click", (event) => {
	event.preventDefault();
	setYXAxis();
	clickNextStep(buttonHeadingFive);
	graphData.state.hasSubmittedXAxis = true;
	}
);

// Step 5: Get Y values of data points from user and put in object
appImage.addEventListener("click", (event) => {
	if (graphData.state.hasSubmittedXAxis === true && graphData.state.hasClickedDataPoints === false) {
		let yParameter = event.offsetY;
		let xParameter = event.offsetX;
		storeCoordinates(yParameter, xParameter);
		createDot(yParameter, xParameter);
		buttonCsvExport.disabled = false;
	} else { }
})

const storeCoordinates = (y, x) => {
	graphData.ySeriesCoordinates[0].push(y);
	graphData.xSeriesCoordinates.push(x);
}

// Export X and Y series keys to .CSV


const exportCsv = () => {
	yValues = [];
	xValues = [];
	const yMaxCoordinate = graphData.yMax.coordinate;
	const yXAxisValue = parseFloat(graphData.yXAxis.value);
	const clickCount = graphData.xSeriesCoordinates.length;
	const yDenominator = - (yMaxCoordinate - graphData.yXAxis.coordinate);
	const	yRange = parseFloat(graphData.yMax.value) - yXAxisValue;
	for (let i = 0; i < clickCount; i++) {
		let	percentMultiplier = 1 - ((graphData.ySeriesCoordinates[0][i] - yMaxCoordinate) / yDenominator);
		yValues.push(Math.round(percentMultiplier * yRange * 10) / 10 + yXAxisValue);
		xValues.push(parseFloat(graphData.xInterval) * i + parseFloat(graphData.xMin));
		console.log(Math.round(percentMultiplier * yRange * 10) / 10);
		console.log(yXAxisValue);
	}
	console.log(xValues);
	console.log(yValues);

	const csvYValues = yValues.join(", ");
	const csvXValues = xValues.join(", ");
	const csvString = [csvYValues, csvXValues].join("\r\n");
	buttonCsvExport.href="data:attachment/csv," + encodeURIComponent(csvString);
	buttonCsvExport.target = "_blank";
	buttonCsvExport.download = "graphExtractorExport.csv";
}

buttonCsvExport.addEventListener("click", (event) => {
	exportCsv();
	graphData.state.hasClickedDataPoints = true;
	}
);

appImage.addEventListener("click", (event) => {
	console.log(`${event.offsetY}, ${event.offsetX}`);
})
