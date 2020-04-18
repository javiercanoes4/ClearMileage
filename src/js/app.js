

App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    // $.getJSON('../pets.json', function (data) {
    //   var petsRow = $('#petsRow');
    //   var petTemplate = $('#petTemplate');

    //   for (i = 0; i < data.length; i++) {
    //     petTemplate.find('.panel-title').text(data[i].name);
    //     petTemplate.find('img').attr('src', data[i].picture);
    //     petTemplate.find('.pet-breed').text(data[i].breed);
    //     petTemplate.find('.pet-age').text(data[i].age);
    //     petTemplate.find('.pet-location').text(data[i].location);
    //     petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

    //     petsRow.append(petTemplate.html());
    //   }
    // });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    // if (window.ethereum) {
    //   App.web3Provider = window.ethereum;
    //   try {
    //     // Request account access
    //     await window.ethereum.enable();
    //   } catch (error) {
    //     // User denied account access...
    //     console.error("User denied account access")
    //   }
    // }
    // // Legacy dapp browsers...
    // else if (window.web3) {
    //   App.web3Provider = window.web3.currentProvider;
    // }
    // // If no injected web3 instance is detected, fall back to Ganache
    // else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    // }
    web3 = new Web3(App.web3Provider);
    //console.log(web3)

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
          //var km = parseInt(v.kmArray[i].km) + 1000*i;
          v.kmArray[i].date = date;
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
                    //parser: timeFormat,
                    // round: 'day'
                    //tooltipFormat: 'll HH:mm'
                    stepSize: 10
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Date'
                  }
                }],
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    //labelString: 'value'
                  }
                }]
              },
            }
          });
        console.log(v)
      })
    })

  },

  // markAdopted: function (adopters, account) {
  //   var adoptionInstance;

  //   App.contracts.Adoption.deployed().then(function (instance) {
  //     adoptionInstance = instance;

  //     return adoptionInstance.getAdopters.call();
  //   }).then(function (adopters) {
  //     for (i = 0; i < adopters.length; i++) {
  //       if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
  //         $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
  //       }
  //     }
  //   }).catch(function (err) {
  //     console.log(err.message);
  //   });
  // },

  // handleAdopt: function (event) {
  //   event.preventDefault();

  //   var petId = parseInt($(event.target).data('id'));

  //   var adoptionInstance;

  //   //var Acc = new Accounts(App.web3Provider);
  //   //var temp = web3.eth.accounts.create()

  //   //var Accounts = window.require('web3-eth-accounts');
  //   console.log(web3)
  //   console.log(web3.eth)
  //   console.log(web3.eth.accounts)
  //   // console.log(temp)

  //   web3.eth.getAccounts(function (error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }

  //     var account = accounts[0];
  //     console.log(accounts)

  //     //console.log(web3.eth.accounts.privateKeyToAccount('0x0e3ca0dc5e48a6dc7809de8c0ea04c157d451544ce45abf45ca664dc089102e9'))

  //     App.contracts.Adoption.deployed().then(function (instance) {
  //       adoptionInstance = instance;

  //       adoptionInstance.setCarInfo("MATR5", 53000, { from: "0xA129526f45e080064a7d4893F70F1e999Bd2bc44" });
  //       adoptionInstance.getCarInfoMatricula("0xA129526f45e080064a7d4893F70F1e999Bd2bc44").then(function (v) { console.log(v) })
  //       adoptionInstance.getCarInfoKm("0xA129526f45e080064a7d4893F70F1e999Bd2bc44").then(function (v) { console.log(v) })

  //       // console.log("Matricula "+ adoptionInstance.getCarInfoMatricula("0xA129526f45e080064a7d4893F70F1e999Bd2bc44").then(function(v){return v}))
  //       // console.log("Km "+ adoptionInstance.getCarInfoKm("0xA129526f45e080064a7d4893F70F1e999Bd2bc44").then(function(v){return v}))

  //       // Execute adopt as a transaction by sending account
  //       // return adoptionInstance.adopt(petId, {from: account});
  //       return adoptionInstance.adopt(petId, { from: accounts[0] });
  //     }).then(function (result) {
  //       return App.markAdopted();
  //     }).catch(function (err) {
  //       console.log(err.message);
  //     });
  //   });
  // }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
