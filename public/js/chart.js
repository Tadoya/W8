const CHART = document.getElementById("lineChart");


//console.log("chart",CHART);
console.log(data,type);

var weightData = {
                    xDates : [],
                    yWeights : [],
                    type : type,
                    goal : [],
                };
for(var key in data){
    var date = new Date(data[key].date);
    weightData.xDates.push((date.getMonth()+1)+"/"+date.getDate());
    weightData.yWeights.push(data[key].weight);
    weightData.goal.push(data[key].goal);
}


var myChartData = {
            labels: weightData.xDates.reverse(),
            datasets: [
                {
                    label: "My Weights("+weightData.type+")",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 10,
                    data: weightData.yWeights.reverse(),
                    spanGaps: false,
                    
                },
                {
                    label: "My Goal : "+weightData.goal[0]+weightData.type,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(255,0,0,0.4)",
                    borderColor: "rgba(255,0,0,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(255,0,0,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 0,
                    pointHoverRadius: 0,
                    pointHoverBackgroundColor: "rgba(255,0,0,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 0,
                    pointRadius: 0,
                    pointHitRadius: 0,
                    data: weightData.goal.reverse(),
                    spanGaps: false,
                    
                }
            ]
        };
        
var chartJsOptions = {
            responsive: false,
            fill: true,
            color : "rgba(255, 255, 255, 1)",
            animation: false,
            scales: {
                yAxes: [{
                    ticks: {
                        //beginAtZero:true,
                        suggestedMax : weightData.yWeights[0]+30,
                        suggestedMin : weightData.yWeights[0]-30,
                        stepSize : 5
                    }
                }],
            }
        //myChartOptions
    };

var lineChart = new Chart(CHART, {
      type : 'line',
      data : myChartData,
      options : chartJsOptions
    });