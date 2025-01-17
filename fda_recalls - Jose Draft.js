// URL of the FDA API with your specific query parameters
const url = "https://api.fda.gov/food/enforcement.json?search=report_date:[20200101+TO+20241005]&limit=500";

// Fetch the data from the FDA API
fetch(url)
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        // Extract the relevant data: state and recall count
        const recalls = data.results;
        
        // Group recalls by state and count the number of recalls per state
        const stateCounts = {};

        recalls.forEach(recall => {
            const state = recall.state;
            if (state) {
                stateCounts[state] = (stateCounts[state] || 0) + 1;
            }
        });

        // Prepare the data for Plotly (states and their recall counts)
        const states = Object.keys(stateCounts);
        const counts = Object.values(stateCounts);

        // Create the choropleth map
        const plotData = [{
            type: "choropleth",
            locationmode: "USA-states",
            locations: states,
            z: counts,
            text: states,
            colorscale: "YlGnBu",
            colorbar: {
                title: "Recalls"
            }
        }];

        const layout = {
            //title: "FDA Recalls by State",
            geo: {
                scope: "usa",
                showlakes: true,
                lakecolor: "rgb(255, 255, 255)"
            }
        };

        // Render the plot
        Plotly.newPlot("choropleth", plotData, layout);
    })
    .catch(error => {
        console.error('Error fetching FDA data:', error);
    });
