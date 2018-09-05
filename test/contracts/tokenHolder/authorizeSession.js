// Copyright 2018 OpenST Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const web3 = require('../../lib/web3'),
  BigNumber = require('bignumber.js'),
  brandedToken = artifacts.require('./BrandedToken.sol'),
  tokenHolder = artifacts.require('./TokenHolder.sol'),
  transferRule = artifacts.require('./TransferRule.sol'),
  tokenRules = artifacts.require('./TokenRules.sol'),
  mockToken = artifacts.require('./MockToken.sol');

module.exports.perform = (accounts) => {
  var tokenHolderInstance = null,
    blockNumber = null,
    mockTokenInstance = null,
    tokenRulesInstance = null,
    deployer = accounts[0],
    coGateway = null,
    requirement = 2,
    wallet1 = accounts[3],
    wallet2 = accounts[1],
    wallets = null,
    receiver = accounts[4],
    ephemeralKey = accounts[7],
    organizationAddress = accounts[1];

  beforeEach(async () => {
    mockTokenInstance = await mockToken.new({ from: deployer });
    tokenRulesInstance = await tokenRules.new(organizationAddress, mockTokenInstance.address);

    coGateway = accounts[6];
    wallets = [wallet1, wallet2];
    tokenHolderInstance = await tokenHolder.new(
      mockTokenInstance.address,
      coGateway,
      tokenRulesInstance.address,
      requirement,
      wallets,
      { from: deployer }
    );
  });

  it('should deploy token holder with two requirements', async () => {
    // Checking already added wallets
    assert.equal(await tokenHolderInstance.isWallet(wallet1), true);
    assert.equal(await tokenHolderInstance.isWallet(wallet2), true);

    // wallet was not added
    assert.equal(await tokenHolderInstance.isWallet(accounts[4]), false);
  });

  it('should verify ephemeral key ', async () => {
    let expirationHeight = (await web3.eth.getBlockNumber()) + 50;
    await tokenHolderInstance.authorizeSession(ephemeralKey, 100, expirationHeight, { from: wallet1 });
    await tokenHolderInstance.authorizeSession(ephemeralKey, 100, expirationHeight, { from: wallet2 });
    let ephemeralKeyData = await tokenHolderInstance.ephemeralKeys(ephemeralKey);

    // checking whether ephemeral key is present
    // ephemeralKeyData :- Spending limit of the key
    assert.isTrue(ephemeralKeyData[0].toNumber() > 0);
  });

  it('should authorizeSession for an ephemeral key with two requirements ', async () => {
    let expirationHeight = (await web3.eth.getBlockNumber()) + 50,
      transactionId = await tokenHolderInstance.authorizeSession.call(ephemeralKey, 100, expirationHeight, {
        from: wallet1
      });

    // Transaction proposed and requirement achieved is 1.
    await tokenHolderInstance.authorizeSession(ephemeralKey, 100, expirationHeight, { from: wallet1 });
    assert.equal(await tokenHolderInstance.isRequirementAchieved(transactionId), false);

    // Transaction proposed and final requirement will be achieved.
    await tokenHolderInstance.authorizeSession(ephemeralKey, 100, expirationHeight, { from: wallet2 });
    assert.equal(await tokenHolderInstance.isRequirementAchieved(transactionId), true);
  });
};
