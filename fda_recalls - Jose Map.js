// URL of the FDA API with your specific query parameters
 const url1 = "https://api.fda.gov/food/enforcement.json?search=report_date:[20200101+TO+20241005]&limit=500";

// Initialize the map with a focus on the USA and an appropriate zoom level
const mapState = L.map('mapState').setView([37.0902, -95.7129], 4); // USA's latitude and longitude

// Set the map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mapState);

// Create a marker cluster group (optional, for better marker management)
const markers1 = L.layerGroup().addTo(mapState);

// Fetch the data from the FDA API
fetch(url1)
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        const recalls = data.results;

        // Group recalls by state and count the number of recalls per state
        const stateCounts = {};

        recalls.forEach(recall => {
            const state = recall.state;
            if (state) {
                stateCounts[state] = (stateCounts[state] || 0) + 1;
            }
        });

        // Define the latitude and longitude for all U.S. states
        const stateLocations = {
            "AL": [32.806671, -86.791130],
            "AK": [61.370716, -149.493686],
            "AZ": [33.729759, -111.431221],
            "AR": [34.868905, -92.019842],
            "CA": [36.778261, -119.417932],
            "CO": [39.550051, -105.782067],
            "CT": [41.602221, -73.049866],
            "DE": [39.318523, -75.507141],
            "FL": [27.766279, -81.686783],
            "GA": [33.040619, -83.643074],
            "HI": [21.094318, -157.498337],
            "ID": [44.299782, -114.742040],
            "IL": [40.673968, -89.398528],
            "IN": [39.849426, -98.579572],
            "IA": [42.011539, -93.210526],
            "KS": [38.526600, -96.726486],
            "KY": [37.668140, -84.670067],
            "LA": [31.169546, -91.867805],
            "ME": [44.693947, -69.381927],
            "MD": [39.063946, -76.802101],
            "MA": [42.230171, -71.530106],
            "MI": [42.314752, -85.602364],
            "MN": [45.694454, -93.900192],
            "MS": [32.741646, -89.678696],
            "MO": [36.379099, -93.292298],
            "MT": [46.921925, -110.454353],
            "NE": [40.851706, -96.462308],
            "NV": [38.313515, -117.055374],
            "NH": [43.452492, -71.563896],
            "NJ": [40.298904, -74.521011],
            "NM": [34.419748, -106.298698],
            "NY": [40.298904, -74.521011],
            "NC": [35.630066, -79.806419],
            "ND": [47.528912, -99.784012],
            "OH": [40.388783, -82.764915],
            "OK": [35.565342, -96.928917],
            "OR": [44.299782, -120.694361],
            "PA": [40.298904, -77.659111],
            "RI": [41.590939, -71.711781],
            "SC": [33.856892, -80.945007],
            "SD": [44.299782, -99.438828],
            "TN": [35.747845, -86.692345],
            "TX": [31.054487, -97.563461],
            "UT": [40.150032, -111.862434],
            "VT": [44.045876, -72.710686],
            "VA": [38.003385, -78.450259],
            "WA": [47.733253, -120.740138],
            "WV": [38.522031, -80.181490],
            "WI": [43.784440, -88.787868],
            "WY": [42.302075, -71.286083]
        };

        // Loop through stateCounts to create circle markers and add to the map
        for (const state in stateCounts) {
            const count = stateCounts[state];
            const location = stateLocations[state];

            if (location) {
                const [lat, lon] = location;

                // Set the size of the bubble based on the recall count, reduced by 20%
                const size = count * 2; // Adjust multiplier for bubble size (20% smaller)

                // Set the color based on the recall count
                const color = count > 10 ? 'red' : count > 5 ? 'orange' : 'green';

                // Create a circle marker for each state
                const circle = L.circleMarker([lat, lon], {
                    radius: size,
                    color: color,
                    weight: 1,
                    fillColor: color,
                    fillOpacity: 0.6
                }).addTo(markers1);

                // Add a popup on click to show state name and recall count
                circle.on('click', () => {
                    circle.bindPopup(`<strong>${state}</strong><br>Recalls: ${count}`).openPopup();
                });
            }
        }
    })
    .catch(error => {
        console.error('Error fetching FDA data:', error);
    });
