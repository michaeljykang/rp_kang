async function getData(){
    const response = await fetch('../data/timing-data.csv');    // .. to moveup one level in folder structure
    const data = await response.text()                          // CSV to Text format
    console.log(data);

    const xGroups = [];     // x-axis label = groups
    const yExpTimes = [];   // y-axis experimental gruop time values
    const yCtrlTimes = [];  // y-axis control group time values
    
    // \n - new line character
    // split('\n') - will seperate the table into an array of individual rows
    // slice(start, end) - return a new array starting at index "start" up and including "end"

    const table = data.split('\n').slice(1); // Split by line and remove first row
    console.log(table);

    yExpTimes.push(0);
    table.forEach(row => {
        const columns = row.split(',');
        const group = columns[0];                    // Assign group value
        if(group.includes('control')) {
            xGroups.push(group.substring(0, group.indexOf('control')));                          // Push each year into array for years
        }


        const time = parseFloat(columns[1]);        // Convert time to float
        if(group.includes('control')){
            yCtrlTimes.push(time);                  // Push time values to array
        } else {
            yExpTimes.push(time);                     
        }
        console.log(group, time);
    });

    return {xGroups, yCtrlTimes, yExpTimes};    // Use {} to return multiple values as a single object
}

async function createChart(){
    const data = await getData(); // createChart will wait for getData() to process CSV
    const timeChart = document.getElementById('timeChart');

    const myChart = new Chart(timeChart, {
        type: 'bar',
        data: {
        labels: data.xGroups,
        datasets: [{
            label: 'Experimental Group Times',
            data: data.yExpTimes,
            backgroundColor:  'rgba(255, 0, 102, 0.2)',    // Color for data marker
            borderColor:      'rgba(255, 0, 102, 1)',      // Color for data marker border 
            borderWidth: 1
        }, {
            label: 'Control Group Times',
            data: data.yCtrlTimes,
            backgroundColor:  'rgba(0, 102, 155, 0.2)',    // Color for data marker
            borderColor:      'rgba(0, 102, 255, 1)',      // Color for data marker border 
            borderWidth: 1
        }]
        },
        options: {
            response: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Starvation Period",
                        font: {
                            size: 14
                        },
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Average Time to Finish (seconds)",
                        font: {
                            size: 14
                        },
                    },
                    min: 0,
                    max: 60,
                }
            },
            plugins: {                  // Display options for title and legend
                title: {
                    display: true,
                    text: 'Planaria Time to Finish Maze',
                    font: {
                        size: 24,
                    },
                    color: '#black',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    align: 'start',
                    position: 'bottom',
                }
            }
        }
        
    });

}


createChart();