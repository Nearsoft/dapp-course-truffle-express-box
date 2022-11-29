var TecContract = artifacts.require("./TecV4.sol");

module.exports = function(deployer) {
  deployer.deploy(TecContract);
};
