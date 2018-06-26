function stateChange (
  msg, state, stateParams, modifier, modParam, expectedChange
) {
  it(msg, async function () {
    const pre = await this.token[state](...stateParams)
    await this.token[modifier](...modParam)
    const post = await this.token[state](...stateParams)
    assert.equal(post.toNumber() + expectedChange, pre.toNumber())
  })
}

module.exports = stateChange
