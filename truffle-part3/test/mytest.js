var HelloWorld = artifacts.require("HelloWorld");


contract('HelloWorld', (accounts) => {
  it('should put 10000 MetaCoin in the first account', async () => {
    const metaCoinInstance = await HelloWorld.deployed();
    const balance = await metaCoinInstance.balance.call(accounts[0]);
    assert.equal(balance.valueOf(), 1000, "10000 wasn't in the first account");
  });
});
contract('HelloWorld', (accounts) => {
  it('should returns name yogesh', async () => {
    const metaCoinInstance = await HelloWorld.deployed();
    const name = await metaCoinInstance.getName.call();
    assert.equal(name, "yogesh", "the name is not yogesh. you are "+name);
  });
});
contract('HelloWorld', (accounts) => {
  it('should returns name bangar', async () => {
    const metaCoinInstance = await HelloWorld.deployed();
    await metaCoinInstance.setName("bangar");
    const name = await metaCoinInstance.getName.call();
    assert.equal(name, "bangar", "the name is not bangar. you are "+name);
  });
});
