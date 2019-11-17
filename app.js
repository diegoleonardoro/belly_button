function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var paneldata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    paneldata.html("");
    // Use `Object.entries` to add each key and value pair to the panel

    Object.entries(data).forEach(([key, value]) => {
      paneldata.append("p").text(`${key}: ${value}`);
    });
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  });
}




// Object.entries() method is used to return an array consisting of enumerable property [key, value] 
// pairs of the object which are passed as the parameter.
// The ordering of the properties is the same as that given by looping 
// over the property values of the object manually.


// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.

// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);




function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data) => {
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    //bubble chart:
    var layout = {
      title: 'Marker Size',
      showlegend: false,
      height: 600,
      width: 600
    };
    var bubbledata = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }];
    Plotly.Plot("bubble", bubbledata, layout);
    //Pie Chart:
    var piedata = [{
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];
    var pieLayout = {
      margin: { t: 0, l: 0 }
    };
    Plotly.plot("pie", piedata, pieLayout);
  });
};

// @TODO: Use `d3.json` to fetch the sample data for the plots
// @TODO: Build a Bubble Chart using the sample data
// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {

  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);


};

// Initialize the dashboard
init();
