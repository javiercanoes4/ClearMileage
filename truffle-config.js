const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider("foot erupt knock pull slam manage meadow book lizard weird artefact science", "https://ropsten.infura.io/v3/9f57387ab6054fc9a3bf6335aaa9fcf6"),
      network_id: '3',
    },
    develop: {
      port: 8545
    }
  }
};
