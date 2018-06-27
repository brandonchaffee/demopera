var Expopulo = artifacts.require('./Expopulo.sol')

module.exports = function (deployer) {
  deployer.deploy(Expopulo, 5000000, 10000)
}
