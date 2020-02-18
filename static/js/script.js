function newCommit() {
    var post_data = {"query": document.getElementById("aaa").value};

    $.ajax({
        url: "/polls/",
        type: "POST",
        data: post_data,
        success: function (data) {

            data = JSON.parse(data);                    
            if (data["status"] == 1) {
                var pp_data = data["result"]["pp"];
                var cb_data = data["result"]["cb"];

                ppFunction(pp_data);
                cbFunction(cb_data);
		            updatePiechart(data["pie_country"],data["pie_portion"],data["sentiment"]);

            } else {
                alert(data["result"]);
            }

        },
    });
}

function usa_filter(){
  var post_data = {"country": "USA", "query": document.getElementById("aaa").value};

  $.ajax({
        url: "/polls/",
        type: "POST",
        data: post_data,
        success: function (data) {

            data = JSON.parse(data);                    
            if (data["status"] == 1) {
                var pp_data = data["result"]["pp"];
                var cb_data = data["result"]["cb"];
                console.log(data["pie_country"]);
                console.log(data["pie_portion"]);


                ppFunction(pp_data);
                cbFunction(cb_data);
                updatePiechart(data["pie_country"],data["pie_portion"],data["sentiment"]);

            } else {
                alert(data["result"]);
            }

        },
    });
}

function india_filter(){
  var post_data = {"country": "India", "query": document.getElementById("aaa").value};

  $.ajax({
        url: "/polls/",
        type: "POST",
        data: post_data,
        success: function (data) {

            data = JSON.parse(data);                    
            if (data["status"] == 1) {
                var pp_data = data["result"]["pp"];
                var cb_data = data["result"]["cb"];
                console.log(data["pie_country"]);
                console.log(data["pie_portion"]);


                ppFunction(pp_data);
                cbFunction(cb_data);
                updatePiechart(data["pie_country"],data["pie_portion"],data["sentiment"]);

            } else {
                alert(data["result"]);
            }

        },
    });
}

function brazil_filter(){
  var post_data = {"country": "Brazil", "query": document.getElementById("aaa").value};

  $.ajax({
        url: "/polls/",
        type: "POST",
        data: post_data,
        success: function (data) {

            data = JSON.parse(data);                    
            if (data["status"] == 1) {
                var pp_data = data["result"]["pp"];
                var cb_data = data["result"]["cb"];
                console.log(data["pie_country"]);
                console.log(data["pie_portion"]);


                ppFunction(pp_data);
                cbFunction(cb_data);
                updatePiechart(data["pie_country"],data["pie_portion"],data["sentiment"]);

            } else {
                alert(data["result"]);
            }

        },
    });
}

function ppFunction(data){
    document.getElementById("fa2").style.width = data["favourites_ratio"];
    document.getElementById("fa1").innerHTML = data["favourites_num"];
    document.getElementById("fa3").innerHTML = data["favourites_num"];

    document.getElementById("li2").style.width = data["listed_ratio"];
    document.getElementById("li1").innerHTML = data["listed_num"];
    document.getElementById("li3").innerHTML = data["listed_num"];

    document.getElementById("fr2").style.width = data["friends_ratio"];
    document.getElementById("fr1").innerHTML = data["friends_num"];
    document.getElementById("fr3").innerHTML = data["friends_num"];

    document.getElementById("fo2").style.width = data["followers_ratio"];
    document.getElementById("fo1").innerHTML = data["followers_num"];
    document.getElementById("fo3").innerHTML = data["followers_num"];
}

function cbFunction(data){
    var date = data["date"];
    var amount = data["amount"];
    var displatTwitter = data["display"];
    updateChar(date, amount);
    updateDisplay(displatTwitter);
}

function updateDisplay (data){
  var displayParent = document.getElementById("ddd");
  var div_html=""
  for(var single of data){
    div_html = div_html + generate_comment_html(single);
  }
  displayParent.innerHTML = div_html;

}

function generate_comment_html(single){
  var retVal = '<div class="col-xl-12 col-md-6 mb-4"><div class="card border-left-primary shadow h-120 py-200"><div class="card-body"><div class="row no-gutters align-items-center"><img class="img-profile rounded-circle" src=';
  retVal = retVal + single["profile"][0] + '>' +'&nbsp;&nbsp;<div class="col mr-0"><div class="m-0 font-weight-bold text-primary">' ;
  retVal = retVal + single['name'][0] +'</div><div class="mb-0 small">' + single['fullText'][0] + '</div><h4 class="small font-weight-bold"> <span class="float-right"> Create at: ';
  retVal = retVal + single['date'] +'</span></h4> </div>';
  originLink = 'https://twitter.com/' + single['screen_name'][0] + '/status/' + single['twitterId'];
  retVal = retVal + '<div class="col-auto"> <a href="' + originLink + '" target="_blank"><i class="fas fa-comments fa-2x text-gray-300"></i></a></div></div></div></div></div>';
  return retVal
  
}

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}




function updateChar(date,amount){
  // test
  var displayParent = document.getElementById("aaa");
  
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    // Area Chart Example

  var parent = document.getElementById("cbChart");
  parent.innerHTML = "<canvas id='myPieChart'></canvas>";
  var ctx = document.getElementById("myPieChart");



  var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: date,
    datasets: [{
      label: "Amount",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: amount,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return  + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
});

}


function updatePiechart(country,portion,sentiment){
    // show the country piechart
    var p = document.getElementById("piechartparent");
    p.innerHTML = "<canvas id='myPieChart1'></canvas>";
    var ctx1 = document.getElementById("myPieChart1");
    var myPieChart = new Chart(ctx1, {
        type: 'doughnut',
        //type: 'pie',
        data: {
            labels: country,
            datasets: [{
                data: portion,
                backgroundColor: ['#4e73df', '#F1948A', '#FFFF00'],
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });

    // show the sentiment piechart
    var p2 = document.getElementById("piechartparent2");
    p2.innerHTML = "<canvas id='myPieChart2'></canvas>";
    var ctx2 = document.getElementById("myPieChart2");
    var myPieChart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ["Positive","Negative"],
            datasets: [{
                data: sentiment,
                backgroundColor: ['#28B463', '#B03A2E'],
            }],
        },
	options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#4e73df",
                borderColor: '#B03A2E',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
        },
    });


}
