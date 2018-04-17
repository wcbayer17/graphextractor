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
      hasSetMaxY: false,
      hasSetYXAxis: false,
      hasSubmittedYRange: false,
      hasClickedDataPoints: false,
    }
  };

// Document Elements
  const accordion = document.querySelector("#accordion");
  const sidePanelUploadButton = document.querySelector("#sidePanelUploadButton");
  const appImage = document.querySelector("#appImage");
  const instructionText = document.querySelector(".instructionText")
  const appImageAnnotationsWrapper = document.querySelector(".appImageAnnotationsWrapper");
  const annotationBoxYMax = document.querySelector("#annotationBoxYMax");
  const annotationBoxYXAxis = document.querySelector("#annotationBoxYXAxis");
  let lineYMax;
  let lineYXAxis;
  
  // buttons
  const buttonDemoGraph = document.querySelector("#buttonDemoGraph");
  const buttonHeadingDefineYRange = document.querySelector("#headingDefineYRange button");
  const buttonHeadingFour = document.querySelector("#headingFour button");
  const buttonHeadingFive = document.querySelector("#headingFive button");
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
  const createHorizontalLineDiv = (y, id) => {
    const line = document.createElement("div");
    line.id = id;
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

/* Graph Upload ==================================================================== */

// Copy and Paste Graph Option
// source: https://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c
const pasteGraph = () => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  const item = items[0];
  if (item.kind === 'file') {
    graphData.appImageFile = item.getAsFile();
    const graphFileReader = new FileReader();
    graphFileReader.onloadend = () => {
      appImage.style.backgroundImage = `url( ${graphFileReader.result} )`;
    }
    if (graphData.appImageFile) {
      graphFileReader.readAsDataURL(graphData.appImageFile);
    }
    beginStepDefineYRange();
  }
}
// Event Listener for Graph Paste
document.addEventListener("paste", pasteGraph);

// DemoImage Option
const getDemoImage = () => {
  appImage.style.backgroundImage = `url("./img/graphDemoChart.png")`;
  beginStepDefineYRange();
}

// Event Listener for Graph Upload
buttonDemoGraph.addEventListener("click", getDemoImage);


// Upload Button Option
const getImage = () => {
  graphData.appImageFile = sidePanelUploadButton.files[0];
  const graphFileReader = new FileReader;
  graphFileReader.onloadend = () => {
    appImage.style.backgroundImage = `url( ${graphFileReader.result} )`;
  }

  if (graphData.appImageFile) {
    graphFileReader.readAsDataURL(graphData.appImageFile);
  }
  beginStepDefineYRange();
}

// Event Listener for Graph Upload
sidePanelUploadButton.addEventListener("change", getImage);
const onClickAppImage = () => {
  sidePanelUploadButton.click();
}
appImage.addEventListener("click", onClickAppImage);


/* Define Y Range ==================================================================== */

// Hides and reveals elements for Define Y Range Step
const beginStepDefineYRange = () => {
  accordion.classList.remove("isInactive");
  instructionText.classList.remove("isInactive");
  instructionText.textContent = "Define the min and max Y Values";
  appImageAnnotationsWrapper.classList.remove("isInactive");
  buttonDemoGraph.classList.add("isInactive");
  graphData.state.hasUploadedGraph = true;
  clickNextStep(buttonHeadingDefineYRange);
  appImage.removeEventListener("click", onClickAppImage);
  createYLinesOnStart();
  formStep3SetMaxYValue.addEventListener("change", () => {
    checkFormInputs(formStep3SetMaxYValue);
  });
  formStep4SetYValue.addEventListener("change", () => {
    checkFormInputs(formStep4SetYValue);
  });

}

// Adds horizontal lines to chart image
const createYLinesOnStart = () => {
  graphData.yMax.coordinate = 32;
  graphData.yXAxis.coordinate = 232;
  createHorizontalLineDiv(graphData.yMax.coordinate, "lineYMax");
  createHorizontalLineDiv(graphData.yXAxis.coordinate, "lineYXAxis");
  lineYMax = document.querySelector("#lineYMax");
  lineYXAxis = document.querySelector("#lineYXAxis");
  dragElement(lineYMax);
  dragAnnotationBox(annotationBoxYMax, graphData.yMax.coordinate);
  dragElement(lineYXAxis);
  dragAnnotationBox(annotationBoxYXAxis, graphData.yXAxis.coordinate);
}

// Makes horizontal line divs vertically draggable
const dragElement = (div) => {
  // pos2 is the absolute distance from top of screen, 
  // pos1 is the last micro change from a drag event being fired (relative)
  let pos1 = 0, pos2 = 0;

  // sets pos 2 to the click y coordinates of the click and then adds event listeners for mouse moving and mouse up (end)
  const dragMouseDown = (e) => {
    e = e || window.event;
    pos2 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  // here, we actually call the dragMouseDown fxn when you click down ires the moment I press down on mouse (i.e. 1st half of a click)
  div.onmousedown = dragMouseDown;

  // onMouseMove is calling this which adjusts the position of the div, and records the data in object store
  const elementDrag = (e) => {
    e = e || window.event;
    pos1 = pos2 - e.clientY;
    pos2 = e.clientY;
    div.style.top = (div.offsetTop - pos1) + "px";

    if (div.id === "lineYMax") {
      graphData.yMax.coordinate = graphData.yMax.coordinate - pos1;
      dragAnnotationBox(annotationBoxYMax, graphData.yMax.coordinate);
    } else if (div.id === "lineYXAxis") {
      graphData.yXAxis.coordinate = graphData.yXAxis.coordinate - pos1;
      dragAnnotationBox(annotationBoxYXAxis, graphData.yXAxis.coordinate);
    }
  }

  // stop moving when mouse button is released:
  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
    // console.log(`new y range pixels are: ${graphData.yMax.coordinate}, ${graphData.yXAxis.coordinate}`)
  }
}

// Move Annotation Boxes with horizontal line divs

const dragAnnotationBox = (div, position) => {
  div.style.top = position - (annotationBoxYMax.clientHeight / 2);
}

const checkFormInputs = (form) => {
  const bool = (form.value !== "");
  switch (form) {
    case formStep3SetMaxYValue:
      graphData.state.hasSetMaxY = bool;
      graphData.yMax.value = formStep3SetMaxYValue.value;      
      break;
    case formStep4SetYValue:
      graphData.state.hasSetYXAxis = bool;
      graphData.yXAxis.value = formStep4SetYValue.value;
      break;
    default:
      break;
  }

  if (graphData.state.hasSetMaxY && graphData.state.hasSetYXAxis) {
    buttonSubmitSetMaxY.disabled = false;
  } else {
    buttonSubmitSetMaxY.disabled = true;
  }
}


buttonSubmitSetMaxY.addEventListener("click", (event) => {
  event.preventDefault();
  clickNextStep(buttonHeadingFive);
  graphData.state.hasSubmittedYRange = true;
  instructionText.textContent = "Click data points and export when finished";
  }
);


// Step 5: Get Y values of data points from user and put in object
appImage.addEventListener("click", (event) => {
  if (graphData.state.hasSubmittedYRange === true && graphData.state.hasClickedDataPoints === false) {
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
  const yRange = parseFloat(graphData.yMax.value) - yXAxisValue;
  for (let i = 0; i < clickCount; i++) {
    let percentMultiplier = 1 - ((graphData.ySeriesCoordinates[0][i] - yMaxCoordinate) / yDenominator);
    yValues.push(Math.round(percentMultiplier * yRange * 10) / 10 + yXAxisValue);
    xValues.push(i + 1);
    // xValues.push(parseFloat(graphData.xInterval) * i + parseFloat(graphData.xMin));
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