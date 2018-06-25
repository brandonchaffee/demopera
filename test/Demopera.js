import { advanceBlock } from './helpers/advanceToBlock'
import { increaseTimeTo, duration } from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import assertRevert from './helpers/assertRevert'
import formHex from './helpers/formHex'

const Demopera = artifacts.require('./Demopera.sol')
const permissionBehavior = require('./behaviors/permissionBehavior.js')
const standardTokenBehavior = require('./behaviors/StandardToken.js')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const supply = 50000
const lockout = 10000
const DOrg = formHex.rand(32)
const DProject = formHex.rand(32)
const DTask = formHex.rand(32)
const DSub = formHex.rand(32)

contract('Demopera', function (accounts) {
  beforeEach(async function () {
    await advanceBlock()
    this.midTime = latestTime() + duration.minutes(10)
    this.endTime = latestTime() + duration.days(1)
    this.token = await Demopera.new(supply, lockout)
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
    const submitter = accounts[5]
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(uniAdmin, DProject)
      await this.token.createTask(uniAdmin, 0, DTask)
      await this.token.setOrgAdminStatus(uniAdmin, orgAdmin, true)
      await this.token.setProjectAdminStatus(uniAdmin, 0, projectAdmin, true)
      await this.token.createSubmission(uniAdmin, 0, 0, DSub, {from: submitter})
    })
    describe('Organization Admin', function () {
      permissionBehavior(
        uniAdmin, target, orgAdmin, assert, assert, assert
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
    describe('Organization', function () {
      const creator = accounts[0]
      const spender = accounts[1]
      const conA = 400
      const conB = 5000
      beforeEach(async function () {
        await this.token.formOrganization(DOrg)
        await this.token.transfer(spender, 500)
      })
      describe('Contributing', function () {
        it('fails without sufficient balance', async function () {
          await assertRevert(this.token.contributeToOrganization(creator, 600,
            {from: spender}))
        })
        it('withdraws from spender', async function () {
          const preBalance = await this.token.balanceOf(spender)
          await this.token.contributeToOrganization(creator, conA,
            {from: spender})
          const postBalance = await this.token.balanceOf(spender)
          assert.equal(postBalance, preBalance - conA)
        })
        it('increments total', async function () {
          await this.token.contributeToOrganization(creator, conA)
          await this.token.contributeToOrganization(creator, conB)
          const total = await this.token.getTotalOrgContribution(creator)
          assert.equal(total, conA + conB)
        })
        it('increments for individuals', async function () {
          await this.token.contributeToOrganization(creator, conA)
          const output = await this.token.getOrgContribtuionOf(creator, creator)
          assert.equal(conA, output)
        })
        it('increments multiple by an individual', async function () {
          await this.token.contributeToOrganization(creator, conA)
          await this.token.contributeToOrganization(creator, conB)
          const output = await this.token.getOrgContribtuionOf(creator, creator)
          assert.equal(output.toNumber(), conA + conB)
        })
      })
      describe('Recalling', function () {
        const contribution = 300
        const recall = 200
        const excessRecall = 350
        beforeEach(async function () {
          await this.token.contributeToOrganization(creator, contribution,
            {from: spender})
        })
        it('deposits back to spender', async function () {
          const pre = await this.token.balanceOf(spender)
          await this.token.recallOrgContribution(creator, recall,
            {from: spender})
          const post = await this.token.balanceOf(spender)
          assert.equal(post.toNumber(), pre.toNumber() + recall)
        })
        it('reverts when exceeds contribution amount', async function () {
          await assertRevert(this.token.recallOrgContribution(creator,
            excessRecall, {from: spender}))
        })
        it('withdraws from contribtuion total', async function () {
          const pre = await this.token.getTotalOrgContribution(creator)
          await this.token.recallOrgContribution(creator, recall,
            {from: spender})
          const post = await this.token.getTotalOrgContribution(creator)
          assert.equal(pre - recall, post)
        })
        it('decrements individual contribution', async function () {
          const pre = await this.token.getOrgContribtuionOf(creator, spender)
          await this.token.recallOrgContribution(creator, recall,
            {from: spender})
          const post = await this.token.getOrgContribtuionOf(creator, spender)
          assert.equal(pre - recall, post)
        })
      })
    })
    describe('Project', function () {
      const creator = accounts[0]
      const spender = accounts[1]
      const conA = 400
      const conB = 5000
      beforeEach(async function () {
        await this.token.formOrganization(DOrg)
        await this.token.transfer(spender, 500)
        await this.token.createProject(creator, DProject)
      })
      describe('Contributing', function () {
        it('fails without sufficient balance', async function () {
          await assertRevert(this.token.contributeToProject(creator, 0, 600,
            {from: spender}))
        })
        it('withdraws from spender', async function () {
          const preBalance = await this.token.balanceOf(spender)
          await this.token.contributeToProject(creator, 0, conA,
            {from: spender})
          const postBalance = await this.token.balanceOf(spender)
          assert.equal(postBalance, preBalance - conA)
        })
        it('increments total', async function () {
          await this.token.contributeToProject(creator, 0, conA)
          await this.token.contributeToProject(creator, 0, conB)
          const total = await this.token.getTotalProjectContribution(creator, 0)
          assert.equal(total, conA + conB)
        })
        it('increments for individuals', async function () {
          await this.token.contributeToProject(creator, 0, conA)
          const output = await this.token.getProjectContributionOf(creator,
            0, creator)
          assert.equal(conA, output)
        })
        it('increments multiple by an individual', async function () {
          await this.token.contributeToProject(creator, 0, conA)
          await this.token.contributeToProject(creator, 0, conB)
          const output = await this.token.getProjectContributionOf(creator,
            0, creator)
          assert.equal(output.toNumber(), conA + conB)
        })
        it('increments individual child for org', async function () {
          await this.token.contributeToProject(creator, 0, conA)
          const output = await this.token.getOrgChildContributionOf(creator,
            creator)
          assert.equal(output.toNumber(), conA)
        })
        it('increments child contribution of org', async function () {
          const pre = await this.token.getOrgChildContribution(creator)
          await this.token.contributeToProject(creator, 0, conA,
            {from: spender})
          const post = await this.token.getOrgChildContribution(creator)
          assert.equal(post.toNumber(), pre.toNumber() + conA)
        })
      })
      describe('Recalling', function () {
        const contribution = 300
        const recall = 200
        const excessRecall = 350
        beforeEach(async function () {
          await this.token.contributeToProject(creator, 0, contribution,
            {from: spender})
        })
        it('deposits back to spender', async function () {
          const pre = await this.token.balanceOf(spender)
          await this.token.recallProjectContribution(creator, 0, recall,
            {from: spender})
          const post = await this.token.balanceOf(spender)
          assert.equal(post.toNumber(), pre.toNumber() + recall)
        })
        it('reverts when exceeds contribution amount', async function () {
          await assertRevert(this.token.recallProjectContribution(creator, 0,
            excessRecall, {from: spender}))
        })
        it('withdraws from contribution total', async function () {
          const pre = await this.token.getTotalProjectContribution(creator, 0)
          await this.token.recallProjectContribution(creator, 0, recall,
            {from: spender})
          const post = await this.token.getTotalProjectContribution(creator, 0)
          assert.equal(pre - recall, post)
        })
        it('decrements individual contribution', async function () {
          const pre = await this.token.getProjectContributionOf(creator, 0,
            spender)
          await this.token.recallProjectContribution(creator, 0, recall,
            {from: spender})
          const post = await this.token.getProjectContributionOf(creator, 0,
            spender)
          assert.equal(pre - recall, post)
        })
        it('decrements individual child for org', async function () {
          await this.token.recallProjectContribution(creator, 0, recall,
            {from: spender})
          const output = await this.token.getOrgChildContributionOf(
            creator, spender)
          assert.equal(output.toNumber(), contribution - recall)
        })
        it('decrements child contribution of org', async function () {
          const pre = await this.token.getOrgChildContribution(creator)
          await this.token.recallProjectContribution(creator, 0, recall,
            {from: spender})
          const post = await this.token.getOrgChildContribution(creator)
          assert.equal(post.toNumber(), pre.toNumber() - recall)
        })
      })
    })
    describe('Taks', function () {
      const creator = accounts[0]
      const spender = accounts[1]
      const conA = 400
      const conB = 5000
      beforeEach(async function () {
        await this.token.formOrganization(DOrg)
        await this.token.transfer(spender, 500)
        await this.token.createProject(creator, DProject)
        await this.token.createTask(creator, 0, DTask)
      })
      describe('Contributing', function () {
        it('fails without sufficient balance', async function () {
          await assertRevert(this.token.contributeToTask(creator, 0, 0, 600,
            {from: spender}))
        })
        it('withdraws from spender', async function () {
          const preBalance = await this.token.balanceOf(spender)
          await this.token.contributeToTask(creator, 0, 0, conA,
            {from: spender})
          const postBalance = await this.token.balanceOf(spender)
          assert.equal(postBalance, preBalance - conA)
        })
        it('increments total', async function () {
          await this.token.contributeToTask(creator, 0, 0, conA)
          await this.token.contributeToTask(creator, 0, 0, conB)
          const total = await this.token.getTotalTaskContribution(creator,
            0, 0)
          assert.equal(total, conA + conB)
        })
        it('increments for individuals', async function () {
          await this.token.contributeToTask(creator, 0, 0, conA)
          const output = await this.token.getTaskContributionOf(creator,
            0, 0, creator)
          assert.equal(conA, output)
        })
        it('increments multiple by an individual', async function () {
          await this.token.contributeToTask(creator, 0, 0, conA)
          await this.token.contributeToTask(creator, 0, 0, conB)
          const output = await this.token.getTaskContributionOf(creator,
            0, 0, creator)
          assert.equal(output.toNumber(), conA + conB)
        })
        it('increments individual child for project', async function () {
          await this.token.contributeToTask(creator, 0, 0, conA)
          const output = await this.token.getProjectChildContributionsOf(
            creator, 0, creator)
          assert.equal(output.toNumber(), conA)
        })
        it('increments child contribution of org', async function () {
          const pre = await this.token.getProjectChildContribution(creator, 0)
          await this.token.contributeToTask(creator, 0, 0, conA,
            {from: spender})
          const post = await this.token.getProjectChildContribution(creator, 0)
          assert.equal(post.toNumber(), pre.toNumber() + conA)
        })
      })
      describe('Recalling', function () {
        const contribution = 300
        const recall = 200
        const excessRecall = 350
        beforeEach(async function () {
          await this.token.contributeToTask(creator, 0, 0, contribution,
            {from: spender})
        })
        it('deposits back to spender', async function () {
          const pre = await this.token.balanceOf(spender)
          await this.token.recallTaskContribution(creator, 0, 0, recall,
            {from: spender})
          const post = await this.token.balanceOf(spender)
          assert.equal(post.toNumber(), pre.toNumber() + recall)
        })
        it('reverts when exceeds contribution amount', async function () {
          await assertRevert(this.token.recallTaskContribution(creator, 0,
            0, excessRecall, {from: spender}))
        })
        it('withdraws from contribution total', async function () {
          const pre = await this.token.getTotalTaskContribution(creator,
            0, 0)
          await this.token.recallTaskContribution(creator, 0, 0, recall,
            {from: spender})
          const post = await this.token.getTotalTaskContribution(creator, 0,
            0)
          assert.equal(pre - recall, post)
        })
        it('decrements individual contribution', async function () {
          const pre = await this.token.getTaskContributionOf(creator, 0, 0,
            spender)
          await this.token.recallTaskContribution(creator, 0, 0, recall,
            {from: spender})
          const post = await this.token.getTaskContributionOf(creator, 0, 0,
            spender)
          assert.equal(pre - recall, post)
        })
        it('decrements individual child for project', async function () {
          await this.token.recallTaskContribution(creator, 0, 0, recall,
            {from: spender})
          const output = await this.token.getProjectChildContributionsOf(
            creator, 0, spender)
          assert.equal(output.toNumber(), contribution - recall)
        })
        it('decrements child contribution of org', async function () {
          const pre = await this.token.getProjectChildContribution(creator, 0)
          await this.token.recallTaskContribution(creator, 0, 0, recall,
            {from: spender})
          const post = await this.token.getProjectChildContribution(creator, 0)
          assert.equal(post.toNumber(), pre.toNumber() - recall)
        })
      })
    })
  })
  describe('Distribution', function () {
    const creator = accounts[0]
    const contribution = 500
    const distribution = 400
    const pID = 0
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
      await this.token.createTask(creator, pID, DTask)
    })
    describe('To Project', function () {
      beforeEach(async function () {
        await this.token.contributeToOrganization(creator, contribution)
        await this.token.contributeToProject(creator, 0, 1000)
      })
      it('fails without sufficient contribution', async function () {
        const excess = 700
        await assertRevert(this.token.distributeToProject(creator, 0, excess))
      })
      it('decrements organization total', async function () {
        const pre = await this.token.getTotalOrgContribution(creator)
        await this.token.distributeToProject(creator, 0, distribution)
        const post = await this.token.getTotalOrgContribution(creator)
        assert.equal(post, pre - distribution)
      })
      it('increments project total', async function () {
        const pre = await this.token.getTotalProjectContribution(creator, 0)
        await this.token.distributeToProject(creator, 0, distribution)
        const post = await this.token.getTotalProjectContribution(creator, 0)
        assert.equal(post.toNumber(), pre.toNumber() + distribution)
      })
      it('increments organization child total', async function () {
        const pre = await this.token.getOrgChildContribution(creator)
        await this.token.distributeToProject(creator, 0, distribution)
        const post = await this.token.getOrgChildContribution(creator)
        assert.equal(post.toNumber(), pre.toNumber() + distribution)
      })
      it('increments project contribtuion of sender', async function () {
        const pre = await this.token.getProjectContributionOf(creator, 0,
          creator)
        await this.token.distributeToProject(creator, 0, distribution)
        const post = await this.token.getProjectContributionOf(creator, 0,
          creator)
        assert.equal(post.toNumber(), pre.toNumber() + distribution)
      })
    })
    describe('To Task', function () {
      beforeEach(async function () {
        await this.token.contributeToProject(creator, 0, contribution)
        await this.token.contributeToTask(creator, 0, 0, 1000)
      })
      it('fails without sufficient contribution', async function () {
        const excess = 700
        await assertRevert(this.token.distributeToTask(creator, 0, 0, excess))
      })
      it('decrements project total', async function () {
        const pre = await this.token.getTotalProjectContribution(creator, 0)
        await this.token.distributeToTask(creator, 0, 0, distribution)
        const post = await this.token.getTotalProjectContribution(creator, 0)
        assert.equal(post, pre - distribution)
      })
      it('increments task total', async function () {
        const pre = await this.token.getTotalTaskContribution(creator, 0, 0)
        await this.token.distributeToTask(creator, 0, 0, distribution)
        const post = await this.token.getTotalTaskContribution(creator, 0, 0)
        assert.equal(post.toNumber(), pre.toNumber() + distribution)
      })
      it('increments project child total', async function () {
        const pre = await this.token.getProjectChildContribution(creator, 0)
        await this.token.distributeToTask(creator, 0, 0, distribution)
        const post = await this.token.getProjectChildContribution(creator, 0)
        assert.equal(post.toNumber(), pre.toNumber() + distribution)
      })
      it('increments task contribtuion of sender', async function () {
        const pre = await this.token.getTaskContributionOf(creator, 0, 0,
          creator)
        await this.token.distributeToTask(creator, 0, 0, distribution)
        const post = await this.token.getTaskContributionOf(creator, 0, 0,
          creator)
        assert.equal(post.toNumber(), pre.toNumber() + distribution)
      })
    })
  })
  describe('Submission', function () {
    const creator = accounts[0]
    const submitter = accounts[1]
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
      await this.token.createTask(creator, 0, DTask)
      await this.token.createSubmission(creator, 0, 0, DSub,
        {from: submitter})
    })
    it('sets details on initialization', async function () {
      const DOutput = await this.token.getSubmissionDetails(creator, 0, 0, 0)
      assert.equal(DOutput, DSub)
    })
    it('details can be modified by creator', async function () {
      const DInput = formHex.rand(32)
      await this.token.modifySubmission(creator, 0, 0, 0, DInput,
        {from: submitter})
      const DOutput = await this.token.getSubmissionDetails(creator, 0, 0, 0)
      assert.equal(DOutput, DInput)
    })
    it('reverts modification by non-creator', async function () {
      const DInput = formHex.rand(32)
      await assertRevert(this.token.modifySubmission(creator, 0, 0, 0, DInput))
    })
  })
  describe('Payment', function () {
    const creator = accounts[0]
    const submitter = accounts[1]
    const payment = 300
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
      await this.token.createTask(creator, 0, DTask)
      await this.token.createSubmission(creator, 0, 0, DSub, {from: submitter})
      await this.token.contributeToTask(creator, 0, 0, 500)
    })
    describe('Disbursing', function () {
      it('reverts if exceeds contribution amount', async function () {
        const amount = 700
        await assertRevert(this.token.disbursePayment(creator, 0, 0, 0, amount))
      })
      it('sets payment amount', async function () {
        await this.token.disbursePayment(creator, 0, 0, 0, payment)
        const POutput = await this.token.getPaymentAmount(creator, 0, 0,
          submitter)
        assert.equal(POutput, payment)
      })
      it('sets unlock time', async function () {
        await this.token.disbursePayment(creator, 0, 0, 0, payment)
        const unlock = await this.token.getPaymentUnlockTime(creator, 0, 0,
          submitter)
        assert.equal(unlock, lockout + latestTime())
      })
    })
    describe('Retrieval', function () {
      beforeEach(async function () {
        await this.token.disbursePayment(creator, 0, 0, 0, payment)
      })
      it('reverts within unlock window', async function () {
        await increaseTimeTo(this.midTime)
        await assertRevert(this.token.retrievePayment(creator, 0, 0,
          {from: submitter}))
      })
      it('deposits to creator', async function () {
        await increaseTimeTo(this.endTime)
        const pre = await this.token.balanceOf(submitter)
        await this.token.retrievePayment(creator, 0, 0, {from: submitter})
        const post = await this.token.balanceOf(submitter)
        assert.equal(post.toNumber(), pre.toNumber() + payment)
      })
      it('decrements task contribution total', async function () {
        await increaseTimeTo(this.endTime)
        const pre = await this.token.getTotalTaskContribution(creator, 0, 0)
        await this.token.retrievePayment(creator, 0, 0, {from: submitter})
        const post = await this.token.getTotalTaskContribution(creator, 0, 0)
        assert.equal(post.toNumber(), pre.toNumber() - payment)
      })
      it('decrements project child contribution total', async function () {
        await increaseTimeTo(this.endTime)
        const pre = await this.token.getProjectChildContribution(creator, 0)
        await this.token.retrievePayment(creator, 0, 0, {from: submitter})
        const post = await this.token.getProjectChildContribution(creator, 0)
        assert.equal(post.toNumber(), pre.toNumber() - payment)
      })
      it('zeros payment after retrieval', async function () {
        await increaseTimeTo(this.endTime)
        await this.token.retrievePayment(creator, 0, 0, {from: submitter})
        const POutput = await this.token.getPaymentAmount(creator, 0, 0,
          submitter)
        assert.equal(POutput, 0)
      })
    })
  })
  describe('Moderation', function () {

  })
  standardTokenBehavior(
    supply, accounts[0], accounts[1], accounts[2], ZERO_ADDRESS
  )
})
