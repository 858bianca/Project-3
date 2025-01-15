// URL of the FDA API with your specific query parameters
const url = "https://api.fda.gov/food/enforcement.json?search=report_date:[20200101+TO+20241005]&limit=500";

// Fetch the data from the FDA API
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data from FDA API');
        }
        return response.json();  // Convert the response to JSON
    })
    .then(apiData => {  // Rename the 'data' variable to 'apiData' here
        if (!apiData || !apiData.results || apiData.results.length === 0) {
            console.error('No data received from the FDA API');
            return;
        }

        const recalls = apiData.results;
        console.log('Fetched Data: ', recalls);

        // Group recalls by state and count the number of recalls per state
        const stateCounts = {};

        recalls.forEach(recall => {
            const state = recall.state;
            if (state) {
                stateCounts[state] = (stateCounts[state] || 0) + 1;
            }
        });

        // Check if the state counts have been populated
        console.log("State Counts: ", stateCounts);

        if (Object.keys(stateCounts).length === 0) {
            console.error('No state data found in the recalls.');
            return;
        }

        // Prepare data for Plotly heatmap
        const states = Object.keys(stateCounts);
        const counts = Object.values(stateCounts);

        // Sort the data by recall count, from largest to smallest
        const sortedData = states.map((state, index) => ({
            state,
            count: counts[index]
        })).sort((a, b) => b.count - a.count);  // Sorting in descending order by count

        // Extract sorted states and counts
        const sortedStates = sortedData.map(item => item.state);
        const sortedCounts = sortedData.map(item => item.count);

        // Check the sorted data
        console.log("Sorted States: ", sortedStates);
        console.log("Sorted Counts: ", sortedCounts);

        // Create a heatmap chart using Plotly
        const heatmapData = [{
            z: [sortedCounts],  // Recalls per state
            x: sortedStates,    // Sorted states
            y: ['Recall Count'],  // Y-axis label
            type: 'heatmap',
            colorscale: 'Reds',
            showscale: true
        }];

        const layout = {
            title: "Heatmap of Recalls by State",
            xaxis: { title: "State", tickangle: 45 },
            yaxis: { title: "Recall Count" },
            height: 600,
            width: 1000,
            margin: { t: 50, b: 150, l: 100, r: 100 },
            showlegend: false
        };

        // Render the heatmap
        Plotly.newPlot('heatmap', heatmapData, layout);
    })
    .catch(error => {
        console.error('Error fetching FDA data:', error);
    });
