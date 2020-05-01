

App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9f57387ab6054fc9a3bf6335aaa9fcf6');
    //App.web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('ClearMileage.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ClearMileageArtifact = data;
      App.contracts.ClearMileage = TruffleContract(ClearMileageArtifact);

      // Set the provider for our contract
      App.contracts.ClearMileage.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    //$(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-read', App.readCar);
    $(document).on('click', '.btn-write', App.writeCar);
  },

  writeCar: function () {
    var ClearMileageInstance;
    var km = parseInt(document.getElementById("nkm").value);
    console.log(km)
    App.contracts.ClearMileage.deployed().then(function (instance) {
      ClearMileageInstance = instance;
      ClearMileageInstance.setCarInfo(document.getElementById("matriculaInput").value, km, { from: document.getElementById("walletInput").value });
      console.log("Write")
    });
  },

  readCar: function () {
    var ClearMileageInstance;
    App.contracts.ClearMileage.deployed().then(function (instance) {
      ClearMileageInstance = instance;

      //ClearMileageInstance.setCarInfo("MATR5", 53000, {from: "0xA129526f45e080064a7d4893F70F1e999Bd2bc44"});
      //ClearMileageInstance.getCarInfoMatricula("0xA129526f45e080064a7d4893F70F1e999Bd2bc44").then(function(v){console.log(v)})
      ClearMileageInstance.getCarInfo(document.getElementById("walletInput").value).then(function (v) {
        console.log(v)
        for (let i = 0; i < v.kmArray.length; ++i) {
          //var date = new Date((v.kmArray[i].date) * 1000 + 3.154e+7*1000*i);
          var date = new Date((v.kmArray[i].date) * 1000 + 604800*1000*i);
          var km = (parseInt(v.kmArray[i].m) * 0.001) + parseInt(v.kmArray[i].km)
          console.log(km)
          //var km = parseInt(v.kmArray[i].km) + 1000*i;
          v.kmArray[i].date = date;
          v.kmArray[i].km = km;
          //v.kmArray[i].km = km;
          //document.getElementById("testP").innerHTML = "KEK";
        }
        document.getElementById("testP").innerHTML = "Matricula: "+ v.matricula;
        
        console.log("testArray")
          console.log(v.kmArray.map(e => {return {t:e.date, y:e.km}}))
          var timeFormat = 'MM/DD/YYYY HH:mm';
          var ctx = document.getElementById('myChart').getContext('2d');
          var myChart = new Chart(ctx, {
            type: 'line',
            //data: v.kmArray.map(e => {return {t:new Date(e.date*1000), y:e.km}}),
            data: {
              labels: v.kmArray.map(e => {return e.date}),
              datasets: [{
                label: 'Km',
                //backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: 'blue',
                fill: false,
                data: v.kmArray.map(e => {return {t:e.date, y:e.km}}),
                lineTension: 0
              }]
            },
            options: {
              responsive: true,
              title: {
                text: 'Kilometraje'
              },
              scales: {
                xAxes: [{
                  type: 'time',
                  time: {
                    stepSize: 10
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Date'
                  }
                }],
                yAxes: [{
                  scaleLabel: {
                    display: true
                  }
                }]
              },
            }
          });
        console.log(v)
      })
    })

  },

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
