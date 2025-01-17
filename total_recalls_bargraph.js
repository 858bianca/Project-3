        // Data for the bar graph
        const classificationCounts = {
            "Class I": 892,
            "Class II": 1004,
            "Class III": 104
        };

        // Prepare the data for Plotly graph
        const categories = Object.keys(classificationCounts);
        const values = Object.values(classificationCounts);

        const data = [{
            x: categories,
            y: values,
            type: 'bar',
            marker: { color: 'rgba(58, 98, 189, 0.8)' }
        }];

        const layout = {
            //title: "Total Recalls by Classification (Class I, II, III)",
            xaxis: {
                title: "Recall Classification",
                tickmode: "linear"
            },
            yaxis: {
                title: "Total Recalls",
            },
            title_x: 0.5,  // Center the title
            height: 600,
            width: 800,
            margin: {
                t: 0,  // Top margin
                b: 50,  // Bottom margin (space below the graph)
                l: 50,  // Left margin
                r: 50   // Right margin
            }
        };

        // Plot the graph
        Plotly.newPlot('graph', data, layout);