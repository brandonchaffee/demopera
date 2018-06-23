var Demopera = artifacts.require('./Demopera.sol')

module.exports = function (deployer) {
  deployer.deploy(Demopera, 5000000, 10000)
}
