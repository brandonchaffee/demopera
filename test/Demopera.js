// import { advanceBlock } from './helpers/advanceToBlock'
// import { increaseTimeTo, duration } from './helpers/increaseTime'
// import latestTime from './helpers/latestTime'

const Demopera = artifacts.require('./Demopera.sol')
const standardTokenBehavior = require('./behaviors/StandardToken.js')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const supply = 50000

contract('Demopera', function (accounts) {
  beforeEach(async function () {
    this.token = await Demopera.new(supply)
  })
  describe('Organizations', function () {

  })
  describe('Projects', function () {

  })
  describe('Tasks', function () {

  })
  describe('Administration', function () {

  })
  describe('Payment', function () {

  })
  describe('Contribution', function () {

  })
  standardTokenBehavior(
    supply, accounts[0], accounts[1], accounts[2], ZERO_ADDRESS
  )
})
