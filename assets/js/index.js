import brain from 'brain.js';
import Chart from 'chart.js';

var closeData = [];
var trainingData = [];
var testData = [];
var net = new brain.recurrent.LSTMTimeStep();
var req = new XMLHttpRequest();

var ctx = document.getElementById('chart').getContext('2d');
var myLineChart = new Chart(ctx, {
  type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'AMD Stock Price',
        data: [],
        backgroundColor: [
          'rgba(71, 183,132,.5)', // Green
        ],
        borderColor: [
          '#47b784',
        ],
        borderWidth: 3
      }],
      options: {
        responsive: false,
        lineTension: 1,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    },
    options: options
});

// GET Stock Data
req.open('GET', 'https://api.iextrading.com/1.0/stock/amd/chart/dynamic');
req.onload = function() {
	var data = [];
	data.push(JSON.parse(req.responseText));
	//console.log(data[0].data);
	for(let i = 0; i < data[0].data.length; i++) {
		closeData.push(data[0].data[i].close);
	}
  for(let i = 0; i < closeData.length; i++) {
    if(i >= closeData.length * 0.8) {
        testData.push(closeData[i]);
    } else {
        trainingData.push(closeData[i]);
    }
  }
  net.train([[19.98, 20.4, 20.9, 22.29, 23.98, 25.26, 25.05, 25.2, 24.89, 25.17, 28.06, 28.51, 27.84, 27.38, 29.89, 30.1, 32.21, 30.48, 32.72, 32.43, 31.93, 31.21]]);
  console.log("Expect: 31.18");
  var output = net.run([25.05, 25.2, 24.89, 25.17, 28.06, 28.51, 27.84, 27.38, 29.89, 30.1, 32.21, 30.48, 32.72, 32.43, 31.93, 31.21]);
  console.log("PREDICT: " + output);
}
req.send();
