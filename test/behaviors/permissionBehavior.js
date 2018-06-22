import formHex from '../helpers/formHex'

function textResult (input) {
  if (input === assert) {
    return ' (permitted)'
  } else {
    return ' (not permitted)'
  }
}
function permissionBehavior (
  org, target, sender, OExpect, PExpect, TExpect
) {
  describe('Organization' + textResult(OExpect), function () {
    it('enable admins', async function () {
      await OExpect(this.token.setOrgAdminStatus(org, target, true,
        {from: sender}))
    })
    it('disable admins', async function () {
      await OExpect(this.token.setOrgAdminStatus(org, target, false,
        {from: sender}))
    })
    it('modify details', async function () {
      const details = formHex.rand(32)
      await OExpect(this.token.modifyOrganization(org, details,
        {from: sender}))
    })
    it('create organization project', async function () {
      const details = formHex.rand(32)
      await OExpect(this.token.createProject(org, details, {from: sender}))
    })
    it('disbtirube to projects', async function () {

    })
  })
  describe('Project' + textResult(PExpect), function () {
    it('enable admins', async function () {
      await PExpect(this.token.setProjectAdminStatus(org, 0, target, true,
        {from: sender}))
    })
    it('disable admins', async function () {
      await PExpect(this.token.setProjectAdminStatus(org, 0, target, false,
        {from: sender}))
    })
    it('modify details', async function () {
      const details = formHex.rand(32)
      await PExpect(this.token.modifyProject(org, 0, details, {from: sender}))
    })
    it('create project task', async function () {
      const details = formHex.rand(32)
      await PExpect(this.token.createTask(org, 0, details, {from: sender}))
    })
    it('disbtirube to task', async function () {

    })
  })
  describe('Task' + textResult(TExpect), function () {
    it('modify details', async function () {
      const details = formHex.rand(32)
      await PExpect(this.token.modifyTask(org, 0, 0, details, {from: sender}))
    })
    it('disburse payment', async function () {

    })
  })
}

module.exports = permissionBehavior
