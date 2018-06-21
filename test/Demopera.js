// import { advanceBlock } from './helpers/advanceToBlock'
// import { increaseTimeTo, duration } from './helpers/increaseTime'
// import latestTime from './helpers/latestTime'
import assertRevert from './helpers/assertRevert'

import randomHex from './helpers/formatHex'

const Demopera = artifacts.require('./Demopera.sol')
// const standardTokenBehavior = require('./behaviors/StandardToken.js')
// const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const supply = 50000
const DOrg = randomHex(32)
const DProject = randomHex(32)
// const DTask = randomHex(32)

contract('Demopera', function (accounts) {
  // const org = accounts[0]
  // const orgAdmin = accounts[1]
  // const project = accounts[2]
  // const projectAdmin = accounts[3]
  beforeEach(async function () {
    this.token = await Demopera.new(supply)
  })
  describe('Organization', function () {
    const org = accounts[0]
    const admin = accounts[1]
    const nonadmin = accounts[2]
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.setOrgAdminStatus(org, admin, true)
    })
    describe('Initailization', function () {
      it('sets details', async function () {
        const OrgStruct = await this.token.orgs(org)
        assert.equal(OrgStruct[0], DOrg)
      })
      it('sets sender as admin', async function () {
        assert(await this.token.getOrgAdminStatus(org, org))
      })
      it('reverts on reinitailization attempt', async function () {
        await assertRevert(this.token.formOrganization(DOrg))
      })
    })
    describe('Details', function () {
      it('can be modified by organization', async function () {
        const newDetails = randomHex(32)
        await this.token.modifyOrganization(org, newDetails)
        const OrgStruct = await this.token.orgs(org)
        assert.equal(OrgStruct[0], newDetails)
      })
      it('can be modified by admin', async function () {
        const newDetails = randomHex(32)
        await this.token.modifyOrganization(org, newDetails, {from: admin})
        const OrgStruct = await this.token.orgs(org)
        assert.equal(OrgStruct[0], newDetails)
      })
      it('reverts modification by nonadmin', async function () {
        const newDetails = randomHex(32)
        await assertRevert(this.token.modifyOrganization(org, newDetails,
          {from: nonadmin}))
      })
    })
    describe('Admins', function () {
      const target = accounts[3]
      it('normal accounts are initailzied to nonadmin', async function () {
        assert(!await this.token.getOrgAdminStatus(org, target))
      })
      it('organization can enable admins', async function () {
        await this.token.setOrgAdminStatus(org, target, true)
        assert(await this.token.getOrgAdminStatus(org, target))
      })
      it('organization can disbale admins', async function () {
        await this.token.setOrgAdminStatus(org, target, true)
        await this.token.setOrgAdminStatus(org, target, false)
        assert(!await this.token.getOrgAdminStatus(org, target))
      })
      it('admin can enable admins', async function () {
        await this.token.setOrgAdminStatus(org, target, true, {from: admin})
        assert(await this.token.getOrgAdminStatus(org, target))
      })
      it('admin can disable admins', async function () {
        await this.token.setOrgAdminStatus(org, target, true, {from: admin})
        await this.token.setOrgAdminStatus(org, target, false, {from: admin})
        assert(!await this.token.getOrgAdminStatus(org, target))
      })
      it('reverts enable by nonadmin', async function () {
        await assertRevert(this.token.setOrgAdminStatus(org, target, true,
          {from: nonadmin}))
      })
      it('reverts disable by nonadmin', async function () {
        await assertRevert(this.token.setOrgAdminStatus(org, admin, false,
          {from: nonadmin}))
      })
    })
    describe('Projects', function () {
      it('can created by admin organization', async function () {
        const DInput = randomHex(32)
        await this.token.createProject(org, DInput)
        const DOutput = await this.token.getProjectDetails(org, 0)
        assert.equal(DInput, DOutput)
      })
      it('can created by admin', async function () {
        const DInput = randomHex(32)
        await this.token.createProject(org, DInput, {from: admin})
        const DOutput = await this.token.getProjectDetails(org, 0)
        assert.equal(DInput, DOutput)
      })
      it('reverts creation by nonadmin', async function () {
        //
        //
        //
        //
      })
      it('allows multiple project creation', async function () {
        for (var i = 0; i < 3; ++i) {
          const DInput = randomHex(32)
          await this.token.createProject(org, DInput)
          const DOutput = await this.token.getProjectDetails(org, i)
          assert.equal(DInput, DOutput)
        }
      })
    })
  })
  describe('Project', function () {
    const org = accounts[0]
    const creator = accounts[1]
    const admin = accounts[2]
    const pID = 0
    beforeEach(async function () {
      await this.token.formOrganization(DOrg, {from: org})
      await this.token.setOrgAdminStatus(org, creator, true, {from: org})
      await this.token.createProject(org, DProject, {from: creator})
      await this.token.setProjectAdminStatus(org, pID, admin, true,
        {from: creator})
    })
    describe('Initialization', function () {
      it('sets details', async function () {
        const DOutput = await this.token.getProjectDetails(org, pID)
        assert.equal(DOutput, DProject)
      })
      it('sets creator as admin', async function () {
        assert(await this.token.getProjectAdminStatus(org, pID, creator))
      })
      it('increments project ids', async function () {
        for (var i = 1; i < 4; ++i) {
          const DInput = randomHex(32)
          await this.token.createProject(org, DInput, {from: creator})
          const DOutput = await this.token.getProjectDetails(org, i)
          assert.equal(DInput, DOutput)
        }
      })
    })
    describe('Details', function () {
      it('can be modified by creator', async function () {
        const DInput = randomHex(32)
        await this.token.modifyProject(org, pID, DInput, {from: creator})
        const DOutput = await this.token.getProjectDetails(org, pID)
        assert.equal(DOutput, DInput)
      })
      it('can be modified by org admin', async function () {
        const DInput = randomHex(32)
        await this.token.modifyProject(org, pID, DInput, {from: org})
        const DOutput = await this.token.getProjectDetails(org, pID)
        assert.equal(DOutput, DInput)
      })
      it('reverts modification by project admin', async function () {

      })
      it('reverts modification by nonadmin', async function () {

      })
    })
    describe('Admins', function () {
      describe('Organization Admin', function () {

      })
      describe('Project Admin', function () {

      })
    })
    describe('Distribution', function () {

    })
    describe('Tasks', function () {

    })
  })
})

// standardTokenBehavior(
//   supply, org, orgAdmin, accounts[2], ZERO_ADDRESS
// )
