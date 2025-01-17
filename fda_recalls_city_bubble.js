// Initialize the map with a focus on the USA and an appropriate zoom level
//const map = L.map('map').setView([37.0902, -95.7129], 4); // USA's latitude and longitude

// Set the map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a marker cluster group (optional, for better marker management)
const markers = L.layerGroup().addTo(map);

// This function will convert a postal code to lat/lon
function getCityCoordinates(postalCode) {
    // Strip out any part of the postal code after a hyphen
    const cleanPostalCode = postalCode.split('-')[0];

    // Example: This function uses a free API to get latitude and longitude from postal code
    //const url = `https://api.zippopotam.us/us/${cleanPostalCode}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.places && data.places[0]) {
                const lat = data.places[0]['latitude'];
                const lon = data.places[0]['longitude'];
                return [lat, lon];
            } else {
                return null; // If no data found, return null
            }
        })
        .catch(error => {
            console.error('Error fetching city coordinates:', error);
            return null;
        });
}

// Fetch the data from the FDA API
fetch(url)
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        const recalls = data.results;

        // Group recalls by city and count the number of recalls per city
        const cityCounts = {};

        recalls.forEach(recall => {
            const city = recall.city;
            const postalCode = recall.postal_code;

            if (city && postalCode) {
                cityCounts[city] = cityCounts[city] || { count: 0, postalCode: postalCode };
                cityCounts[city].count += 1;
            }
        });

        // Loop through cityCounts to create circle markers and add to the map
        const cityPromises = Object.keys(cityCounts).map(async city => {
            const count = cityCounts[city].count;
            const postalCode = cityCounts[city].postalCode;

            const coordinates = await getCityCoordinates(postalCode);
            if (coordinates) {
                const [lat, lon] = coordinates;

                // Set the size of the bubble based on the recall count
                const size = count * 2; // Adjust multiplier for bubble size

                // Set the color based on the recall count
                const color = count > 10 ? 'red' : count > 5 ? 'orange' : 'green';

                // Create a circle marker for each city
                const circle = L.circleMarker([lat, lon], {
                    radius: size,
                    color: color,
                    weight: 1,
                    fillColor: color,
                    fillOpacity: 0.6
                }).addTo(markers);

                // Add a popup on click to show city name and recall count
                circle.on('click', () => {
                    circle.bindPopup(`<strong>${city}</strong><br>Recalls: ${count}`).openPopup();
                });
            }
        });

        // Wait for all promises (coordinates) to resolve
        Promise.all(cityPromises).then(() => {
            console.log('Finished processing all cities.');
        });
    })
    .catch(error => {
        console.error('Error fetching FDA data:', error);
    });