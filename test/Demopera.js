import { advanceBlock } from './helpers/advanceToBlock'
import { increaseTimeTo, duration } from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import assertRevert from './helpers/assertRevert'
import formHex from './helpers/formHex'

const Demopera = artifacts.require('./Demopera.sol')
const permissionBehavior = require('./behaviors/permissionBehavior.js')
const standardTokenBehavior = require('./behaviors/StandardToken.js')
// const stateChange = require('./behaviors/stateChange.js')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const supply = 50000
const lockout = 10000
const DOrg = formHex.rand(32)
const DProject = formHex.rand(32)
const DTask = formHex.rand(32)
const DSub = formHex.rand(32)

contract('Demopera', function (accounts) {
  const creator = accounts[0]
  const admin = accounts[1]
  const pID = 0
  const tID = 0
  beforeEach(async function () {
    await advanceBlock()
    this.midTime = latestTime() + duration.minutes(10)
    this.endTime = latestTime() + duration.days(1)
    this.token = await Demopera.new(supply, lockout)
  })
  describe('Organization', function () {
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.setAdminStatus(creator, admin, true)
    })
    it('sets details on initialization', async function () {
      const OrgStruct = await this.token.orgs(creator)
      assert.equal(OrgStruct[0], DOrg)
    })
    it('sets sender as admin on initialization', async function () {
      assert(await this.token.getAdminStatus(creator, creator))
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
      const DOutput = await this.token.getProject(creator, 0)
      assert.equal(DProject, DOutput[0])
    })
    it('increments project ids on initialization', async function () {
      for (var i = 0; i < 3; ++i) {
        const DInput = formHex.rand(32)
        await this.token.createProject(creator, DInput)
        const DOutput = await this.token.getProject(creator, i)
        assert.equal(DInput, DOutput[0])
      }
    })
  })

  describe('Project', function () {
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
    })
    it('sets details on initialization', async function () {
      const DOutput = await this.token.getProject(creator, pID)
      assert.equal(DOutput[0], DProject)
    })
    it('details can be modified', async function () {
      const DInput = formHex.rand(32)
      await this.token.modifyProject(creator, pID, DInput)
      const DOutput = await this.token.getProject(creator, pID)
      assert.equal(DOutput[0], DInput)
    })
    it('reverts empty detail modification', async function () {
      const emptyDetails = formHex.pad('0x00', 32)
      await assertRevert(this.token.modifyProject(creator, pID, emptyDetails))
    })
    it('can create task', async function () {
      await this.token.createTask(creator, pID, DTask)
      const DOutput = await this.token.getTask(creator, pID, 0)
      assert.equal(DOutput[0], DTask)
    })
    it('increments tasks ids on initialization', async function () {
      for (var i = 0; i < 3; ++i) {
        const DInput = formHex.rand(32)
        await this.token.createTask(creator, pID, DInput)
        const DOutput = await this.token.getTask(creator, pID, i)
        assert.equal(DInput, DOutput[0])
      }
    })
  })

  describe('Task', function () {
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
      await this.token.createTask(creator, pID, DTask)
    })
    it('sets details on initialization', async function () {
      const DOutput = await this.token.getTask(creator, pID, tID)
      assert.equal(DOutput[0], DTask)
    })
    it('details can be modified', async function () {
      const DInput = formHex.rand(32)
      await this.token.modifyTask(creator, pID, tID, DInput)
      const DOutput = await this.token.getTask(creator, pID, tID)
      assert.equal(DOutput[0], DInput)
    })
    it('reverts empty detail modification', async function () {
      const emptyDetails = formHex.pad('0x00', 32)
      await assertRevert(this.token.modifyTask(creator, pID, tID, emptyDetails))
    })
  })

  describe('Permissions', function () {
    const nonAdmin = accounts[2]
    const target = accounts[3]
    const submitter = accounts[4]
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
      await this.token.createTask(creator, 0, DTask)
      await this.token.setAdminStatus(creator, admin, true)
      await this.token.createSubmission(creator, 0, 0, DSub, {from: submitter})
    })
    describe('Admin', function () {
      permissionBehavior(
        creator, target, admin, assert, assert, assert
      )
    })
    describe('Non Admin', function () {
      permissionBehavior(
        creator, target, nonAdmin, assertRevert, assertRevert,
        assertRevert
      )
    })
  })

  describe('Contribution', function () {
    const spender = accounts[1]
    const conA = 400
    const conB = 5000
    const contribution = 300
    const recall = 200
    const excessRecall = 350
    describe('Organization', function () {
      beforeEach(async function () {
        await this.token.formOrganization(DOrg)
        await this.token.transfer(spender, 500)
      })
      describe('Contributing', function () {
        describe('For the Organization', function () {
          beforeEach(async function () {
            await this.token.contributeToOrganization(creator, conA)
            await this.token.contributeToOrganization(creator, conB)
          })
          it('increments total', async function () {
            const OrgStruct = await this.token.orgs(creator)
            assert.equal(OrgStruct[1], conA + conB)
          })
          it('increments stakes', async function () {
            const OrgStruct = await this.token.orgs(creator)
            assert.equal(OrgStruct[2], conA + conB)
          })
        })
        describe('For the Sender', function () {
          it('fails without sufficient balance', async function () {
            await assertRevert(this.token.contributeToOrganization(creator, 600,
              {from: spender}))
          })
          it('withdraws from balance', async function () {
            const preBalance = await this.token.balanceOf(creator)
            await this.token.contributeToOrganization(creator, conA)
            const postBalance = await this.token.balanceOf(creator)
            assert.equal(postBalance, preBalance - conA)
          })
          it('increments contribution', async function () {
            await this.token.contributeToOrganization(creator, conA)
            await this.token.contributeToOrganization(creator, conB)
            const output = await this.token.getOrgContribtuionOf(creator, creator)
            assert.equal(output.toNumber(), conA + conB)
          })
          it('increments stake', async function () {
            await this.token.contributeToOrganization(creator, conA)
            await this.token.contributeToOrganization(creator, conB)
            const output = await this.token.getStakeOf(creator, creator)
            assert.equal(output.toNumber(), conA + conB)
          })
        })
      })
      describe('Recalling', function () {
        beforeEach(async function () {
          await this.token.contributeToOrganization(creator, contribution)
        })
        describe('For the Organization', function () {
          it('decrements total', async function () {
            const pre = await this.token.orgs(creator)
            await this.token.recallOrganizationContribution(creator, recall)
            const post = await this.token.orgs(creator)
            assert.equal(pre[1].toNumber() - recall, post[1].toNumber())
          })
          it('decrements stakes', async function () {
            const pre = await this.token.orgs(creator)
            await this.token.recallOrganizationContribution(creator, recall)
            const post = await this.token.orgs(creator)
            assert.equal(pre[2].toNumber() - recall, post[2].toNumber())
          })
          it('reverts when exceeds total (distributed)', async function () {
            await this.token.createProject(creator, DProject)
            await this.token.distributeToProject(creator, 0, 150)
            await assertRevert(this.token.recallOrganizationContribution(
              creator, recall))
          })
        })
        describe('For the Sender', function () {
          it('reverts when amount exceeds contribution', async function () {
            await assertRevert(this.token.recallOrganizationContribution(
              creator, excessRecall))
          })
          it('deposits to balance', async function () {
            const pre = await this.token.balanceOf(creator)
            await this.token.recallOrganizationContribution(creator, recall)
            const post = await this.token.balanceOf(creator)
            assert.equal(post.toNumber(), pre.toNumber() + recall)
          })
          it('decrements contribution', async function () {
            await this.token.recallOrganizationContribution(creator, recall)
            const output = await this.token.getOrgContribtuionOf(creator, creator)
            assert.equal(output.toNumber(), contribution - recall)
          })
          it('decrements stake', async function () {
            await this.token.recallOrganizationContribution(creator, recall)
            const output = await this.token.getStakeOf(creator, creator)
            assert.equal(output.toNumber(), contribution - recall)
          })
        })
      })
    })
    describe('Project', function () {
      beforeEach(async function () {
        await this.token.formOrganization(DOrg)
        await this.token.transfer(spender, 500)
        await this.token.createProject(creator, DProject)
      })
      describe('Contributing', function () {
        describe('For the Organization', function () {
          it('increments total stakes', async function () {
            await this.token.contributeToProject(creator, 0, conA)
            const OrgStruct = await this.token.orgs(creator)
            assert.equal(OrgStruct[2].toNumber(), conA)
          })
        })
        describe('For the Project', function () {
          it('increments total', async function () {
            await this.token.contributeToProject(creator, 0, conA)
            const ProjectStruct = await this.token.getProject(creator, 0)
            assert.equal(ProjectStruct[1], conA)
          })
        })
        describe('For the Sender', function () {
          it('fails without sufficient balance', async function () {
            await assertRevert(this.token.contributeToProject(creator, 0, 600,
              {from: spender}))
          })
          it('withdraws from balance', async function () {
            const preBalance = await this.token.balanceOf(creator)
            await this.token.contributeToProject(creator, 0, conA)
            const postBalance = await this.token.balanceOf(creator)
            assert.equal(postBalance, preBalance - conA)
          })
          it('increments contribution', async function () {
            await this.token.contributeToProject(creator, 0, conA)
            await this.token.contributeToProject(creator, 0, conB)
            const output = await this.token.getProjectContributionOf(creator,
              0, creator)
            assert.equal(output.toNumber(), conA + conB)
          })
          it('increments stake', async function () {
            await this.token.contributeToProject(creator, 0, conA)
            await this.token.contributeToProject(creator, 0, conB)
            const output = await this.token.getStakeOf(creator, creator)
            assert.equal(output.toNumber(), conA + conB)
          })
        })
      })
      describe('Recalling', function () {
        beforeEach(async function () {
          await this.token.contributeToProject(creator, 0, contribution)
        })
        describe('For the Organization', function () {
          it('decrements stakes', async function () {
            await this.token.recallProjectContribution(creator, 0, recall)
            const OrgStruct = await this.token.orgs(creator)
            assert.equal(OrgStruct[2].toNumber(), contribution - recall)
          })
        })
        describe('For the Project', function () {
          it('reverts when exceeds total (distributed)', async function () {
            await this.token.createTask(creator, 0, DTask)
            await this.token.distributeToTask(creator, 0, 0, 150)
            await assertRevert(this.token.recallProjectContribution(creator,
              0, recall))
          })
          it('decrements total', async function () {
            await this.token.recallProjectContribution(creator, 0, recall)
            const ProjectStruct = await this.token.getProject(creator, 0)
            assert.equal(ProjectStruct[1].toNumber(), contribution - recall)
          })
        })
        describe('For the Sender', function () {
          it('reverts when amount exceeds contribution', async function () {
            await assertRevert(this.token.recallProjectContribution(creator,
              0, excessRecall))
          })
          it('deposits to balance', async function () {
            const pre = await this.token.balanceOf(creator)
            await this.token.recallProjectContribution(creator, 0, recall)
            const post = await this.token.balanceOf(creator)
            assert.equal(post.toNumber(), pre.toNumber() + recall)
          })
          it('decrements contribution', async function () {
            await this.token.recallProjectContribution(creator, 0, recall)
            const output = await this.token.getProjectContributionOf(creator,
              0, creator)
            assert.equal(output.toNumber(), contribution - recall)
          })
          it('decrements stake', async function () {
            await this.token.recallProjectContribution(creator, 0, recall)
            const output = await this.token.getStakeOf(creator, creator)
            assert.equal(output.toNumber(), contribution - recall)
          })
        })
      })
    })
    describe('Taks', function () {
      beforeEach(async function () {
        await this.token.formOrganization(DOrg)
        await this.token.transfer(spender, 500)
        await this.token.createProject(creator, DProject)
        await this.token.createTask(creator, 0, DTask)
      })
      describe('Contributing', function () {
        describe('For the Organization', function () {
          it('increments total stakes', async function () {
            await this.token.contributeToTask(creator, 0, 0, conA)
            const OrgStruct = await this.token.orgs(creator)
            assert.equal(OrgStruct[2].toNumber(), conA)
          })
        })
        describe('For the Task', function () {
          it('increments total', async function () {
            await this.token.contributeToTask(creator, 0, 0, conA)
            const TaskStruct = await this.token.getTask(creator, 0, 0)
            assert.equal(TaskStruct[1], conA)
          })
        })
        describe('For the Sender', function () {
          it('fails without sufficient balance', async function () {
            await assertRevert(this.token.contributeToTask(creator, 0, 0, 600,
              {from: spender}))
          })
          it('withdraws from balance', async function () {
            const preBalance = await this.token.balanceOf(creator)
            await this.token.contributeToTask(creator, 0, 0, conA)
            const postBalance = await this.token.balanceOf(creator)
            assert.equal(postBalance, preBalance - conA)
          })
          it('increments contribution', async function () {
            await this.token.contributeToTask(creator, 0, 0, conA)
            await this.token.contributeToTask(creator, 0, 0, conB)
            const output = await this.token.getTaskContributionOf(creator,
              0, 0, creator)
            assert.equal(output.toNumber(), conA + conB)
          })
          it('increments stake', async function () {
            await this.token.contributeToTask(creator, 0, 0, conA)
            await this.token.contributeToTask(creator, 0, 0, conB)
            const output = await this.token.getStakeOf(creator, creator)
            assert.equal(output.toNumber(), conA + conB)
          })
        })
      })
      describe('Recalling', function () {
        beforeEach(async function () {
          await this.token.contributeToTask(creator, 0, 0, contribution)
        })
        describe('For the Organization', function () {
          it('decrements stakes', async function () {
            await this.token.recallTaskContribution(creator, 0, 0, recall)
            const OrgStruct = await this.token.orgs(creator)
            assert.equal(OrgStruct[2].toNumber(), contribution - recall)
          })
        })
        describe('For the Task', function () {
          it('reverts when exceeds total (disbursed)', async function () {
            await this.token.createSubmission(creator, 0, 0, DSub)
            await this.token.disbursePayment(creator, 0, 0, 0, 150)
            await increaseTimeTo(this.endTime)
            await this.token.retrievePayment(creator, 0, 0)
            await assertRevert(this.token.recallProjectContribution(creator,
              0, recall))
          })
          it('decrements total', async function () {
            await this.token.recallTaskContribution(creator, 0, 0, recall)
            const TaskStruct = await this.token.getTask(creator, 0, 0)
            assert.equal(TaskStruct[1].toNumber(), contribution - recall)
          })
        })
        describe('For the Sender', function () {
          it('reverts when amount exceeds contribution', async function () {
            await assertRevert(this.token.recallTaskContribution(creator, 0,
              0, excessRecall))
          })
          it('deposits to balance', async function () {
            const pre = await this.token.balanceOf(creator)
            await this.token.recallTaskContribution(creator, 0, 0, recall)
            const post = await this.token.balanceOf(creator)
            assert.equal(post.toNumber(), pre.toNumber() + recall)
          })
          it('decrements contribution', async function () {
            await this.token.recallTaskContribution(creator, 0, 0, recall)
            const output = await this.token.getTaskContributionOf(creator,
              0, 0, creator)
            assert.equal(output.toNumber(), contribution - recall)
          })
          it('decrements stake', async function () {
            await this.token.recallTaskContribution(creator, 0, 0, recall)
            const output = await this.token.getStakeOf(creator, creator)
            assert.equal(output.toNumber(), contribution - recall)
          })
        })
      })
    })
  })

  describe('Distribution', function () {
    const contribution = 500
    const distribution = 400
    const recall = 300
    const excess = 700
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
      await this.token.createTask(creator, pID, DTask)
    })
    describe('Project', function () {
      describe('Distribute To', function () {
        beforeEach(async function () {
          await this.token.contributeToOrganization(creator, contribution)
          await this.token.contributeToProject(creator, 0, 1000)
        })
        it('reverts without sufficient contribution', async function () {
          await assertRevert(this.token.distributeToProject(creator, 0, excess))
        })
        it('decrements organization total', async function () {
          const pre = await this.token.orgs(creator)
          await this.token.distributeToProject(creator, 0, distribution)
          const post = await this.token.orgs(creator)
          assert.equal(post[1].toNumber(), pre[1].toNumber() - distribution)
        })
        it('increments project total and distributed', async function () {
          const pre = await this.token.getProject(creator, 0)
          await this.token.distributeToProject(creator, 0, distribution)
          const post = await this.token.getProject(creator, 0)
          assert.equal(post[1].toNumber(), pre[1].toNumber() + distribution)
          assert.equal(post[2].toNumber(), pre[2].toNumber() + distribution)
        })
      })
      describe('Recall From', function () {
        beforeEach(async function () {
          await this.token.contributeToOrganization(creator, contribution)
          await this.token.distributeToProject(creator, 0, distribution)
        })
        it('reverts when exceeding distributed amount', async function () {
          await assertRevert(this.token.recallProjectDistribution(creator,
            0, excess))
        })
        it('reverts if exceeds total (task distributed)', async function () {
          await this.token.distributeToTask(creator, 0, 0, 200)
          await assertRevert(this.token.recallProjectDistribution(creator,
            0, recall))
        })
        it('decrements project total and distributed', async function () {
          await this.token.recallProjectDistribution(creator, 0, recall)
          const ProjectStruct = await this.token.getProject(creator, 0)
          assert.equal(ProjectStruct[1].toNumber(), distribution - recall)
        })
        it('increments organization total', async function () {
          const pre = await this.token.orgs(creator)
          await this.token.recallProjectDistribution(creator, 0, recall)
          const post = await this.token.orgs(creator)
          assert.equal(post[1].toNumber(), pre[1].toNumber() + recall)
        })
      })
    })
    describe('Task', function () {
      describe('Distribute To', function () {
        beforeEach(async function () {
          await this.token.contributeToProject(creator, 0, contribution)
          await this.token.contributeToTask(creator, 0, 0, 1000)
        })
        it('reverts without sufficient contribution', async function () {
          await assertRevert(this.token.distributeToTask(creator, 0, 0, excess))
        })
        it('decrements project total', async function () {
          const pre = await this.token.getProject(creator, 0)
          await this.token.distributeToTask(creator, 0, 0, distribution)
          const post = await this.token.getProject(creator, 0)
          assert.equal(post[1].toNumber(), pre[1].toNumber() - distribution)
        })
        it('increments task total and distributed', async function () {
          const pre = await this.token.getTask(creator, 0, 0)
          await this.token.distributeToTask(creator, 0, 0, distribution)
          const post = await this.token.getTask(creator, 0, 0)
          assert.equal(post[1].toNumber(), pre[1].toNumber() + distribution)
          assert.equal(post[2].toNumber(), pre[2].toNumber() + distribution)
        })
      })
      describe('Recall From', function () {
        beforeEach(async function () {
          await this.token.contributeToProject(creator, 0, contribution)
          await this.token.distributeToTask(creator, 0, 0, distribution)
        })
        it('reverts when exceeding distributed amount', async function () {
          await assertRevert(this.token.recallTaskDistribution(creator,
            0, 0, excess))
        })
        it('reverts if exceeds total (payment disbursed)', async function () {
          await this.token.createSubmission(creator, 0, 0, DSub)
          await this.token.disbursePayment(creator, 0, 0, 0, 200)
          await increaseTimeTo(this.endTime)
          await this.token.retrievePayment(creator, 0, 0)
          await assertRevert(this.token.recallProjectDistribution(creator,
            0, recall))
        })
        it('decrements task total and distributed', async function () {
          await this.token.recallTaskDistribution(creator, 0, 0, recall)
          const ProjectStruct = await this.token.getTask(creator, 0, 0)
          assert.equal(ProjectStruct[1].toNumber(), distribution - recall)
          assert.equal(ProjectStruct[2].toNumber(), distribution - recall)
        })
        it('increments project total', async function () {
          const pre = await this.token.getProject(creator, 0)
          await this.token.recallTaskDistribution(creator, 0, 0, recall)
          const post = await this.token.getProject(creator, 0)
          assert.equal(post[1].toNumber(), pre[1].toNumber() + recall)
        })
      })
    })
  })

  describe('Submission', function () {
    const submitter = accounts[1]
    beforeEach(async function () {
      await this.token.formOrganization(DOrg)
      await this.token.createProject(creator, DProject)
      await this.token.createTask(creator, 0, DTask)
      await this.token.createSubmission(creator, 0, 0, DSub,
        {from: submitter})
    })
    it('sets details on initialization', async function () {
      const DOutput = await this.token.getSubmission(creator, 0, 0, 0)
      assert.equal(DOutput[0], DSub)
    })
    it('details can be modified by creator', async function () {
      const DInput = formHex.rand(32)
      await this.token.modifySubmission(creator, 0, 0, 0, DInput,
        {from: submitter})
      const DOutput = await this.token.getSubmission(creator, 0, 0, 0)
      assert.equal(DOutput[0], DInput)
    })
    it('reverts modification by non-creator', async function () {
      const DInput = formHex.rand(32)
      await assertRevert(this.token.modifySubmission(creator, 0, 0, 0, DInput))
    })
  })

  describe('Payment', function () {
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
        const POutput = await this.token.getPayment(creator, 0, 0, submitter)
        assert.equal(POutput[0], payment)
      })
      it('sets unlock time', async function () {
        await this.token.disbursePayment(creator, 0, 0, 0, payment)
        const POutput = await this.token.getPayment(creator, 0, 0, submitter)
        assert.equal(POutput[1], lockout + latestTime())
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
        const pre = await this.token.getTask(creator, 0, 0)
        await this.token.retrievePayment(creator, 0, 0, {from: submitter})
        const post = await this.token.getTask(creator, 0, 0)
        assert.equal(post[1].toNumber(), pre[1].toNumber() - payment)
      })
      it('zeros payment after retrieval', async function () {
        await increaseTimeTo(this.endTime)
        await this.token.retrievePayment(creator, 0, 0, {from: submitter})
        const POutput = await this.token.getPayment(creator, 0, 0,
          submitter)
        assert.equal(POutput[0], 0)
      })
    })
  })

  describe('Moderation', function () {

  })

  standardTokenBehavior(
    supply, accounts[0], accounts[1], accounts[2], ZERO_ADDRESS
  )
})
