// URL to fetch the FDA recall data
// const url = "https://api.fda.gov/food/enforcement.json?search=report_date:[20200101+TO+20241005]&limit=500";
// Fetch the data from the FDA API
fetch(url)
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        const recalls = data.results;
        // Create a map to count recalls by state and classification
        const stateClassificationCount = {};
        // Process each recall to update the count for the state and classification
        recalls.forEach(recall => {
            const state = recall.state ? recall.state.toUpperCase() : '';  // Ensure state is uppercase
            const classification = recall.classification || 'Unknown';  // Default to 'Unknown' if classification is missing
            // Skip if state or classification is not available
            if (state && classification) {
                // Initialize state and classification counts if not already done
                if (!stateClassificationCount[state]) {
                    stateClassificationCount[state] = {};
                }
                if (!stateClassificationCount[state][classification]) {
                    stateClassificationCount[state][classification] = 0;
                }
                // Increment the count for this state and classification
                stateClassificationCount[state][classification]++;
            }
        });
        // Convert the stateClassificationCount object to a matrix (array of arrays) suitable for a heatmap
        const stateNames = Object.keys(stateClassificationCount);
        const classifications = ['Class I', 'Class II', 'Class III'];  // Predefined classifications
        const heatmapData = classifications.map(classification => {
            return stateNames.map(state => stateClassificationCount[state][classification] || 0);  // Handle missing values as 0
        });
        // Create a heatmap using Plotly
        const fig = {
            data: [{
                z: heatmapData,  // The 2D array of recall counts
                x: stateNames,   // States on the X-axis
                y: classifications,  // Classifications on the Y-axis
                type: 'heatmap',
                colorscale: 'Reds',  // Color scale for the heatmap
                colorbar: {
                    title: 'Number of Recalls'
                }
            }],
            layout: {
                //title: "FDA Recalls Heatmap by State and Classification",
                xaxis: {
                    title: 'State'
                },
                yaxis: {
                    title: 'Recall Classification'
                },
                height: 600,
                width: 1300
            }
        };
        // Render the heatmap in the 'heatmap' div
        Plotly.newPlot('heatmap', fig.data, fig.layout);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
