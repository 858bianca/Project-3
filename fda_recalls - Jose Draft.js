// Data for the visualization (sample dataset; replace with your MongoDB export or API response)
const stateCounts = [
    { state: "CA", count: 50 },
    { state: "TX", count: 40 },
    { state: "NY", count: 30 },
    { state: "FL", count: 25 },
    { state: "IL", count: 20 }
];

// Extract state abbreviations and counts
const states = stateCounts.map(item => item.state);
const counts = stateCounts.map(item => item.count);

// Create the choropleth map
const data = [{
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
    title: "FDA Recalls by State",
    geo: {
        scope: "usa",
        showlakes: true,
        lakecolor: "rgb(255, 255, 255)"
    }
};

// Render the plot
Plotly.newPlot("choropleth", data, layout);