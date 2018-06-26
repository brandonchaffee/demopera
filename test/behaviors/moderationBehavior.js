const add = (a, b) => a + b

function moderationBehavior (
  votingFunc, votesOfFunc, orgVotePosition, creator, subject, stakers,
  stakeValues, increase, adminResult
) {
  it('increments total with multiple voters', async function () {
    for (var i = 0; i < stakers.length; ++i) {
      await this.token[votingFunc](creator, subject, true, {from: stakers[i]})
      const AdminStruct = await this.token.getAdmin(creator, subject)
      const enableTotal = stakeValues.slice(0, i + 1).reduce(add)
      assert.equal(AdminStruct[orgVotePosition].toNumber(), enableTotal)
    }
  })
  it('increments senders votes on true', async function () {
    await this.token[votingFunc](creator, subject, true, {from: stakers[1]})
    const voteOf = await this.token[votesOfFunc](creator, subject, stakers[1])
    assert.equal(voteOf.toNumber(), stakeValues[1])
  })
  it('increments total and sender votes with new stake', async function () {
    await this.token[votingFunc](creator, subject, true, {from: stakers[1]})
    let voteTotal = await this.token[votesOfFunc](creator, subject, stakers[1])
    assert.equal(voteTotal.toNumber(), stakeValues[1])
    await this.token.contributeToOrganization(creator, increase,
      {from: stakers[1]})
    await this.token[votingFunc](creator, subject, true,
      {from: stakers[1]})
    voteTotal = await this.token[votesOfFunc](creator, subject, stakers[1])
    assert.equal(voteTotal.toNumber(), stakeValues[1] + increase)
  })
  it('decrements total on false', async function () {
    await this.token[votingFunc](creator, subject, true, {from: stakers[1]})
    await this.token[votingFunc](creator, subject, false, {from: stakers[1]})
    const AdminStruct = await this.token.getAdmin(creator, subject)
    assert.equal(AdminStruct[orgVotePosition].toNumber(), 0)
  })
  it('zeros sender votes on false', async function () {
    await this.token[votingFunc](creator, subject, true, {from: stakers[1]})
    await this.token[votingFunc](creator, subject, false, {from: stakers[1]})
    const voteOf = await this.token[votesOfFunc](creator, subject, stakers[1])
    assert.equal(voteOf, 0)
  })
  it('enables subject with 50% stake enabling', async function () {
    const totalStake = await this.token.orgs(creator)
    await this.token[votingFunc](creator, subject, true, {from: stakers[0]})
    let AdminStruct = await this.token.getAdmin(creator, subject)
    assert.equal(AdminStruct[0], !adminResult)
    assert(!(AdminStruct[orgVotePosition].toNumber() * 2 >= totalStake[2].toNumber()))

    await this.token[votingFunc](creator, subject, true, {from: stakers[1]})
    AdminStruct = await this.token.getAdmin(creator, subject)
    assert.equal(AdminStruct[0], adminResult)
    assert((AdminStruct[orgVotePosition].toNumber() * 2 >=
     totalStake[2].toNumber()))
  })
}

module.exports = moderationBehavior
