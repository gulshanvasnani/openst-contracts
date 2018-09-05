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
    coGateway = accounts[6],
    requirement = 1,
    wallet1 = accounts[3],
    wallet2 = accounts[1],
    wallets = [wallet1, wallet2],
    receiver = accounts[4],
    ephemeralKey = accounts[7],
    organization = accounts[2],
    organizationAddress = accounts[1];

  it('should execute rule', async () => {
    mockTokenInstance = await mockToken.new({ from: deployer });
    tokenRulesInstance = await tokenRules.new(organization, mockTokenInstance.address);

    let transferRuleInstance = await transferRule.new(tokenRulesInstance.address);
    let registerRuleResponse = await tokenRulesInstance.registerRule('TransferRule', transferRuleInstance.address, {
      from: organization
    });

    tokenHolderInstance = await tokenHolder.new(
      mockTokenInstance.address,
      coGateway,
      tokenRulesInstance.address,
      requirement,
      wallets,
      { from: deployer }
    );

    let blockNumber = await web3.eth.getBlockNumber();
    await tokenHolderInstance.authorizeSession(ephemeralKey, 200, blockNumber + 5000, { from: wallet1 });
    assert.equal(await tokenHolderInstance.isAuthorizedEphemeralKey.call(ephemeralKey), true);
    let response = await mockTokenInstance.transfer(tokenHolderInstance.address, 100, { from: deployer });
    assert.equal(await mockTokenInstance.balanceOf(tokenHolderInstance.address), 100);
    response = await mockTokenInstance.transfer(receiver, 100, { from: deployer });
    assert.equal(await mockTokenInstance.balanceOf(receiver), 100);

    let amountToTransfer = new BigNumber(100),
      encodedData = await transferRuleInstance.contract.transferFrom.getData(
        tokenHolderInstance.address,
        receiver,
        amountToTransfer
      );

    let callPrefix = encodedData.substring(0, 10);

    let ephemeralKeyData = await tokenHolderInstance.ephemeralKeys.call(ephemeralKey);
    let bigNumberNonce = new BigNumber(ephemeralKeyData[1]),
      ephemeralKeyNonce = bigNumberNonce.add(1).toString(10);

    let executableData = web3.utils.soliditySha3(
      { t: 'bytes', v: '0x19' },
      { t: 'bytes', v: '0x00' },
      { t: 'address', v: tokenHolderInstance.address },
      { t: 'address', v: transferRuleInstance.address },
      { t: 'uint8', v: '0' },
      { t: 'bytes', v: encodedData },
      { t: 'uint256', v: ephemeralKeyNonce },
      { t: 'uint8', v: '0' },
      { t: 'uint8', v: '0' },
      { t: 'uint8', v: '0' },
      { t: 'bytes4', v: callPrefix },
      { t: 'uint8', v: '0' },
      { t: 'bytes', v: '0x' }
    );

    let signature = await web3.eth.sign(executableData, ephemeralKey);
    signature = signature.slice(2);
    let r = '0x' + signature.slice(0, 64),
      s = '0x' + signature.slice(64, 128),
      v = web3.utils.toDecimal('0x' + signature.slice(128, 130)) + 27;

    let result = await tokenHolderInstance.executeRule.call(
      tokenHolderInstance.address,
      transferRuleInstance.address,
      ephemeralKeyNonce,
      encodedData,
      callPrefix,
      v,
      r,
      s,
      { from: wallet1 }
    );

    await tokenHolderInstance.executeRule(
      tokenHolderInstance.address,
      transferRuleInstance.address,
      ephemeralKeyNonce,
      encodedData,
      callPrefix,
      v,
      r,
      s,
      { from: wallet1 }
    );

    assert.equal((await mockTokenInstance.balanceOf(tokenHolderInstance.address)).toString(10), 0);
    assert.equal((await mockTokenInstance.balanceOf(receiver)).toString(10), 200);
    assert.equal(await result, true);
  });
};
