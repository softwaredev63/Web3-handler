const Web3 = require("web3");

function generateWallet() {
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  // const loader = setupLoader({ provider: web3 }).web3;

  return web3.eth.accounts.create();
}

module.exports = {
  generateWallet,
};
