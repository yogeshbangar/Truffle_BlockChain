var Money = artifacts.require("./Money.sol");

module.exports = function(deployer) {
  deployer.deploy(Money);
};
