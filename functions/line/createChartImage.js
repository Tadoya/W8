module.exports = function (weightData, callback) {
    const ChartjsNode = require('chartjs-node');
    const mkdirp = require("mkdirp");

    var chartNode = new ChartjsNode(700, 700);
    
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
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 5,
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
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255,0,0,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: weightData.goal.reverse(),
                    spanGaps: false,
                }
            ]
        };
    
    var chartJsOptions = {
        type: 'line',
        data: myChartData,
        options: {
            responsive: false,
            fill: true,
            // width: 400,
            // height: 400,
            color : "rgba(255, 255, 255, 1)",
            animation: false,
            scales: {
                yAxes: [{
                    ticks: {
                        //beginAtZero:true,
                        suggestedMax : weightData.yWeights[0]+30,
                        suggestedMin : weightData.yWeights[0]-30
                    }
                }],
            }
        //myChartOptions
        }
    };
    
    // var chartDirName = weightData.user_key+new Date().getUTCMilliseconds();
    var chartTimestamp = new Date().getTime();    

    return chartNode.drawChart(chartJsOptions)
    .then(() => {
        // chart is created
        // get image as png buffer
        return chartNode.getImageBuffer('image/png');
    }).then(buffer => {
        Array.isArray(buffer); // => true
        // as a stream
        return chartNode.getImageStream('image/png');
    }).then(streamResult => {
        // using the length property you can do things like
        // directly upload the image to s3 by using the
        // stream and length properties
        streamResult.stream; // => Stream object
        streamResult.length; // => Integer length of stream
        mkdirp(__dirname+'/../../public/charts/line/'+weightData.user_key+'/'+chartTimestamp, function(err){
            if (err){
                console.error("eeee",err);
                return null;
            }else {
                // write to a file
                chartNode.writeImageToFile('image/png', './public/charts/line/'+weightData.user_key+'/'+chartTimestamp+'/240');
                chartNode.writeImageToFile('image/png', './public/charts/line/'+weightData.user_key+'/'+chartTimestamp+'/300');
                chartNode.writeImageToFile('image/png', './public/charts/line/'+weightData.user_key+'/'+chartTimestamp+'/460');
                chartNode.writeImageToFile('image/png', './public/charts/line/'+weightData.user_key+'/'+chartTimestamp+'/700');
                return chartNode.writeImageToFile('image/png', './public/charts/line/'+weightData.user_key+'/'+chartTimestamp+'/1040');
            }
        });
    }).then(() => {
        return callback(chartTimestamp);
        // chart is now written to the file path
        // ./testimage.png
    });
    
};