// import { advanceBlock } from './helpers/advanceToBlock'
// import { increaseTimeTo, duration } from './helpers/increaseTime'
// import latestTime from './helpers/latestTime'
import assertRevert from './helpers/assertRevert'
import formHex from './helpers/formHex'

const Demopera = artifacts.require('./Demopera.sol')
const permissionBehavior = require('./behaviors/permissionBehavior.js')
const standardTokenBehavior = require('./behaviors/StandardToken.js')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const supply = 50000
const DOrg = formHex.rand(32)
const DProject = formHex.rand(32)
const DTask = formHex.rand(32)

contract('Demopera', function (accounts) {
  beforeEach(async function () {
    this.token = await Demopera.new(supply)
  })
  describe('Organization', function () {
    const creator = accounts[0]
    const admin = accounts[1]
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.setOrgAdminStatus(creator, admin, true)
    })
    it('sets details on initialization', async function () {
      const OrgStruct = await this.token.orgs(creator)
      assert.equal(OrgStruct[0], DOrg)
    })
    it('sets sender as admin on initialization', async function () {
      assert(await this.token.getOrgAdminStatus(creator, creator))
    })
    it('reverts on reinitailization attempt', async function () {
      await assertRevert(this.token.formOrganization(DOrg))
    })
    it('details can be modified', async function () {
      const newDetails = formHex.rand(32)
      await this.token.modifyOrganization(creator, newDetails)
      const OrgStruct = await this.token.orgs(creator)
      assert.equal(OrgStruct[0], newDetails)
    })
    it('reverts empty detail modification', async function () {
      const emptyDetails = formHex.pad('0x00', 32)
      await assertRevert(this.token.modifyOrganization(creator, emptyDetails))
    })
    it('can create project', async function () {
      await this.token.createProject(creator, DProject)
      const DOutput = await this.token.getProjectDetails(creator, 0)
      assert.equal(DProject, DOutput)
    })
    it('increments project ids on initialization', async function () {
      for (var i = 0; i < 3; ++i) {
        const DInput = formHex.rand(32)
        await this.token.createProject(creator, DInput)
        const DOutput = await this.token.getProjectDetails(creator, i)
        assert.equal(DInput, DOutput)
      }
    })
  })
  describe('Project', function () {
    const creator = accounts[0]
    const pID = 0
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
    })
    it('sets details on initialization', async function () {
      const DOutput = await this.token.getProjectDetails(creator, pID)
      assert.equal(DOutput, DProject)
    })
    it('sets sender as admin on initialization', async function () {
      assert(await this.token.getProjectAdminStatus(creator, pID, creator))
    })
    it('details can be modified', async function () {
      const DInput = formHex.rand(32)
      await this.token.modifyProject(creator, pID, DInput)
      const DOutput = await this.token.getProjectDetails(creator, pID)
      assert.equal(DOutput, DInput)
    })
    it('reverts empty detail modification', async function () {
      const emptyDetails = formHex.pad('0x00', 32)
      await assertRevert(this.token.modifyProject(creator, pID, emptyDetails))
    })
    it('can create task', async function () {
      await this.token.createTask(creator, pID, DTask)
      const DOutput = await this.token.getTaskDetails(creator, pID, 0)
      assert.equal(DOutput, DTask)
    })
    it('increments tasks ids on initialization', async function () {
      for (var i = 0; i < 3; ++i) {
        const DInput = formHex.rand(32)
        await this.token.createTask(creator, pID, DInput)
        const DOutput = await this.token.getTaskDetails(creator, pID, i)
        assert.equal(DInput, DOutput)
      }
    })
  })
  describe('Task', function () {
    const creator = accounts[0]
    const pID = 0
    const tID = 0
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
      await this.token.createTask(creator, pID, DTask)
    })
    it('sets details on initialization', async function () {
      const DOutput = await this.token.getTaskDetails(creator, pID, tID)
      assert.equal(DOutput, DTask)
    })
    it('details can be modified', async function () {
      const DInput = formHex.rand(32)
      await this.token.modifyTask(creator, pID, tID, DInput)
      const DOutput = await this.token.getTaskDetails(creator, pID, tID)
      assert.equal(DOutput, DInput)
    })
    it('reverts empty detail modification', async function () {
      const emptyDetails = formHex.pad('0x00', 32)
      await assertRevert(this.token.modifyTask(creator, pID, tID, emptyDetails))
    })
  })
  describe('Permissions', function () {
    const uniAdmin = accounts[0]
    const orgAdmin = accounts[1]
    const projectAdmin = accounts[2]
    const nonAdmin = accounts[3]
    const target = accounts[4]
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(uniAdmin, DProject)
      await this.token.createTask(uniAdmin, 0, DTask)
      await this.token.setOrgAdminStatus(uniAdmin, orgAdmin, true)
      await this.token.setProjectAdminStatus(uniAdmin, 0, projectAdmin, true)
    })
    describe('Organization Admin', function () {
      permissionBehavior(
        uniAdmin, target, orgAdmin, assert, assertRevert, assertRevert
      )
    })
    describe('Project Admin', function () {
      permissionBehavior(
        uniAdmin, target, projectAdmin, assertRevert, assert, assert
      )
    })
    describe('Non Admin', function () {
      permissionBehavior(
        uniAdmin, target, nonAdmin, assertRevert, assertRevert,
        assertRevert
      )
    })
  })
  describe('Contribution', function () {
    it('fails without sufficient balance', async function () {

    })
    describe('Organization', function () {
      it('accounts total', async function () {

      })
      it('accounts for individuals', async function () {

      })
      it('accounts multiple by an individual', async function () {

      })
      it('can be recalled', async function () {

      })
    })
    describe('Project', function () {
      it('accounts total', async function () {

      })
      it('accounts for individuals', async function () {

      })
      it('accounts multiple by an individual', async function () {

      })
      it('can be recalled', async function () {

      })
      it('accounts child contribtuion', async function () {

      })
    })
    describe('Taks', function () {
      it('accounts total', async function () {

      })
      it('accounts for individuals', async function () {

      })
      it('accounts multiple by an individual', async function () {

      })
      it('can be recalled', async function () {

      })
      it('accounts child contribtuion', async function () {

      })
    })
  })
  describe('Distribution', function () {
    beforeEach(async function () {

    })
  })
  standardTokenBehavior(
    supply, accounts[0], accounts[1], accounts[2], ZERO_ADDRESS
  )
})
