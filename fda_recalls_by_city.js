// Sample data with all U.S. states, including those with no recall data
const stateCounts = [
    {State: "AL", RecallCount: 0, City: "Birmingham", CityRecalls: 0},
    {State: "AK", RecallCount: 0, City: "Anchorage", CityRecalls: 0},
    {State: "AZ", RecallCount: 100, City: "Phoenix", CityRecalls: 50},
    {State: "AR", RecallCount: 0, City: "Little Rock", CityRecalls: 0},
    {State: "CA", RecallCount: 500, City: "Los Angeles", CityRecalls: 200},
    {State: "CO", RecallCount: 120, City: "Denver", CityRecalls: 60},
    {State: "CT", RecallCount: 30, City: "Hartford", CityRecalls: 20},
    {State: "DE", RecallCount: 0, City: "Dover", CityRecalls: 0},
    {State: "FL", RecallCount: 350, City: "Miami", CityRecalls: 100},
    {State: "GA", RecallCount: 200, City: "Atlanta", CityRecalls: 80},
    {State: "HI", RecallCount: 0, City: "Honolulu", CityRecalls: 0},
    {State: "ID", RecallCount: 40, City: "Boise", CityRecalls: 15},
    {State: "IL", RecallCount: 250, City: "Chicago", CityRecalls: 120},
    {State: "IN", RecallCount: 50, City: "Indianapolis", CityRecalls: 30},
    {State: "IA", RecallCount: 10, City: "Des Moines", CityRecalls: 5},
    {State: "KS", RecallCount: 5, City: "Topeka", CityRecalls: 3},
    {State: "KY", RecallCount: 30, City: "Louisville", CityRecalls: 15},
    {State: "LA", RecallCount: 60, City: "New Orleans", CityRecalls: 40},
    {State: "ME", RecallCount: 0, City: "Augusta", CityRecalls: 0},
    {State: "MD", RecallCount: 90, City: "Baltimore", CityRecalls: 50},
    {State: "MA", RecallCount: 110, City: "Boston", CityRecalls: 60},
    {State: "MI", RecallCount: 150, City: "Detroit", CityRecalls: 70},
    {State: "MN", RecallCount: 80, City: "Minneapolis", CityRecalls: 40},
    {State: "MS", RecallCount: 10, City: "Jackson", CityRecalls: 5},
    {State: "MO", RecallCount: 20, City: "St. Louis", CityRecalls: 12},
    {State: "MT", RecallCount: 0, City: "Helena", CityRecalls: 0},
    {State: "NE", RecallCount: 10, City: "Lincoln", CityRecalls: 5},
    {State: "NV", RecallCount: 100, City: "Las Vegas", CityRecalls: 50},
    {State: "NH", RecallCount: 0, City: "Concord", CityRecalls: 0},
    {State: "NJ", RecallCount: 150, City: "Newark", CityRecalls: 60},
    {State: "NM", RecallCount: 30, City: "Albuquerque", CityRecalls: 20},
    {State: "NY", RecallCount: 400, City: "New York", CityRecalls: 180},
    {State: "NC", RecallCount: 200, City: "Charlotte", CityRecalls: 90},
    {State: "ND", RecallCount: 0, City: "Bismarck", CityRecalls: 0},
    {State: "OH", RecallCount: 300, City: "Columbus", CityRecalls: 140},
    {State: "OK", RecallCount: 40, City: "Oklahoma City", CityRecalls: 20},
    {State: "OR", RecallCount: 50, City: "Portland", CityRecalls: 30},
    {State: "PA", RecallCount: 0, City: "Philadelphia", CityRecalls: 0},
    {State: "RI", RecallCount: 0, City: "Providence", CityRecalls: 0},
    {State: "SC", RecallCount: 10, City: "Columbia", CityRecalls: 5},
    {State: "SD", RecallCount: 0, City: "Pierre", CityRecalls: 0},
    {State: "TN", RecallCount: 60, City: "Nashville", CityRecalls: 30},
    {State: "TX", RecallCount: 450, City: "Houston", CityRecalls: 150},
    {State: "UT", RecallCount: 70, City: "Salt Lake City", CityRecalls: 40},
    {State: "VT", RecallCount: 0, City: "Montpelier", CityRecalls: 0},
    {State: "VA", RecallCount: 100, City: "Richmond", CityRecalls: 50},
    {State: "WA", RecallCount: 130, City: "Seattle", CityRecalls: 70},
    {State: "WV", RecallCount: 10, City: "Charleston", CityRecalls: 5},
    {State: "WI", RecallCount: 80, City: "Madison", CityRecalls: 40},
    {State: "WY", RecallCount: 0, City: "Cheyenne", CityRecalls: 0}
];
// Define colors for different recall ranges
const noRecallColor = 'rgb(21, 255, 0)';  // Red for states with no recalls
const highRecallColor = 'rgb(153, 0, 0)'; // Dark red for high recall counts
const mediumRecallColor = 'rgb(204, 0, 0)'; // Light red for medium recall counts
const lowRecallColor = 'rgb(255, 102, 102)'; // Pink for low recall counts
// Function to plot the choropleth map
function plotRecallDistributionByState() {
    // Modify the data to assign the correct color to each state
    const modifiedStateCounts = stateCounts.map(state => {
        return {
            ...state,
            color: state.RecallCount === 0 ? noRecallColor : getColorForRecallCount(state.RecallCount)
        };
    });
    // Function to get the color for a state based on its recall count
    function getColorForRecallCount(count) {
        if (count > 400) return highRecallColor;   // Dark red for high recall counts
        if (count > 200) return mediumRecallColor; // Light red for medium recall counts
        if (count > 0) return lowRecallColor;      // Pink for low recall counts
        return noRecallColor; // Red for no recalls
    }
    // Define the map layout and configuration
    const layout = {
        geo: {
            scope: 'usa',
            projection: {type: 'albers usa'},
            lakecolor: 'rgb(255, 255, 255)',
        },
        //title: "Total Recalls by State (2020-2024)",
    };
    // Create the map data for Plotly
    const mapData = {
        type: 'choropleth',
        locations: modifiedStateCounts.map(item => item.State),
        locationmode: 'USA-states',
        z: modifiedStateCounts.map(item => item.RecallCount),
        text: modifiedStateCounts.map(item => `${item.State}: ${item.CityRecalls} recalls in ${item.City}`),
        hoverinfo: 'location+z+text',
        colorscale: 'YlOrRd',
        colorbar: {title: 'Recall Count'},
        marker: {
            color: modifiedStateCounts.map(item => item.color), // Use the color array
        },
    };
    // Create the choropleth map with Plotly
    Plotly.newPlot('choroplethMap', [mapData], layout);
}
// Call the function to plot the map
plotRecallDistributionByState();