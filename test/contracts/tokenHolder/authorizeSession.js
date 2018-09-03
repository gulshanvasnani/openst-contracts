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
// Test: remove.js
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

// tokenRulesInstance = tokenRules.new(accounts[4],accounts[2]);
//
// transferRuleInstance = transferRule.new(tokenRulesInstance);
// tokenRulesInstance.registerRule(transferRuleInstance);
// let encodedData = tokenRulesInstance.contract.transferFrom.getData(accounts[5],accounts[6]);
// console.log(encodedData);

const web3 = require('../../lib/web3'),
  BigNumber = require('bignumber.js'),
  Hasher = artifacts.require('./Hasher.sol'),
  brandedToken = artifacts.require('./BrandedToken.sol'),
  tokenHolder = artifacts.require('./TokenHolder.sol'),
  transferRule = artifacts.require('./TransferRule.sol'),
  tokenRules = artifacts.require('./TokenRules.sol'),
  mockToken = artifacts.require('./MockToken.sol');

module.exports.perform = (accounts) => {
  const openSTProtocol = accounts[0],
    conversionRateDecimals = 5,
    conversionRate = new BigNumber(10 * 10 ** conversionRateDecimals),
    chainIDValue = 3,
    chainIDUtility = 1410,
    symbol = 'symbol',
    name = 'name',
    organizationAddress = accounts[1],
    token = null;
  let tokenHolderInstance, newAccount, blockNumber, mockTokenInstance;
  beforeEach(async () => {
    const hasher = await Hasher.new();
    const tokenRules = accounts[0];
    const valueToken = accounts[1];
    mockTokenInstance = await brandedToken.new(
      valueToken,
      symbol,
      name,
      18,
      chainIDValue,
      chainIDUtility,
      conversionRate,
      conversionRateDecimals,
      organizationAddress,
      { from: openSTProtocol }
    );
  });

  // it('should deploy token holder with two requirements', async () => {
  //   tokenHolderInstance = await tokenHolder.new(mockTokenInstance.address, accounts[3], accounts[1], 2, [
  //     accounts[7],
  //     accounts[6]
  //   ]);
  //
  //   assert.equal(await tokenHolderInstance.isWallet(accounts[6]), true);
  //   assert.equal(await tokenHolderInstance.isWallet(accounts[4]), false);
  // });
  //
  // it('should authorizeSession for an ephemeral key with two requirements ', async () => {
  //   //newAccount = web3.eth.accounts.create(web3.utils.randomHex(32));
  //   let transactionId = await tokenHolderInstance.authorizeSession.call(
  //     accounts[3],
  //     100,
  //     (await web3.eth.getBlockNumber()) + 50,
  //     { from: accounts[7] }
  //   );
  //
  //   blockNumber = await web3.eth.getBlockNumber();
  //
  //   // Transaction proposed and requirement achieved is 1.
  //   await tokenHolderInstance.authorizeSession(accounts[3], 100, blockNumber + 50, { from: accounts[7] });
  //   assert.equal(await tokenHolderInstance.isRequirementAchieved(transactionId), false);
  //
  //   // Transaction proposed and final requirement will be achieved.
  //   await tokenHolderInstance.authorizeSession(accounts[3], 100, blockNumber + 50, { from: accounts[6] });
  //   assert.equal(await tokenHolderInstance.isRequirementAchieved(transactionId), true);
  // });
  //
  // it('should verify ephemeral keys ', async () => {
  //   let ephemeralKeyData = await tokenHolderInstance.ephemeralKeys(accounts[3]);
  //
  //   // checking whether ephemeral key is present
  //   assert(ephemeralKeyData[0].toNumber() > 0);
  //   assert.isTrue(ephemeralKeyData[0].toNumber() > 0);
  // });

  // it('should execute an rule', async () => {
  //
  //
  //   let ephemeralKeyData = await tokenHolderInstance.ephemeralKeys(accounts[3]);
  //
  //   let signer = accounts[3],
  //     msgToBeSignedFromWeb3Utils = web3Utils.soliditySha3(
  //       { t: 'bytes', v: '0x19' },
  //       { t: 'bytes', v: '0x00' },
  //       { t: 'address', v: tokenHolderInstance.address },
  //       { t: 'address', v: '0xdca86553f179820bf7a17b4eb9a9d52fe92013b4' },
  //       { t: 'uint8', v: 0 },
  //       { t: 'bytes32', v: '0xdca86553f179820bf7a17b4eb9a9d52fe92013b4' },
  //       { t: 'uint256', v: ephemeralKeyData[1].toNumber() },
  //       { t: 'uint8', v: 0 },
  //       { t: 'uint8', v: 0 },
  //       { t: 'uint8', v: 0 },
  //       { t: 'bytes4', v: '0xdca86553' },
  //       { t: 'uint8', v: 0 },
  //       { t: 'bytes', v: '' }
  //     );
  //
  //   //console.log("using web3 utils :- ",msgToBeSignedFromWeb3Utils);
  //   let signature = await web3.eth.sign(msgToBeSignedFromWeb3Utils, signer);
  //
  //   signature = signature.slice(2);
  //   const r = '0x' + signature.slice(0, 64);
  //   const s = '0x' + signature.slice(64, 128);
  //   const v = '0x' + signature.slice(128, 130);
  //   let v_decimal = web3.utils.toDecimal(v) + 27;
  //
  //   let transaction = await tokenHolderInstance.executeRule(
  //     tokenHolderInstance.address,
  //     '0xdca86553f179820bf7a17b4eb9a9d52fe92013b4',
  //     ephemeralKeyData[1].toNumber(),
  //     '0xdca86553f179820bf7a17b4eb9a9d52fe92013b4',
  // 		'0xdca86553',
  //     v_decimal,
  //     r,
  //     s
  //   );
  //
  //   console.log(JSON.stringify(transaction));
  //   console.log("Signer :- ",signer);
  // });

  // it('should execute simple contract', async () => {
  //
  //
  // 		let ephemeralKeyData = await tokenHolderInstance.ephemeralKeys(accounts[3]);
  // 		let checkReturn = simpleContract.contract.simply.getData();
  // 		let signer = accounts[3],
  // 				msgToBeSignedFromWeb3Utils = web3Utils.soliditySha3(
  // 						{ t: 'bytes', v: '0x19' },
  // 						{ t: 'bytes', v: '0x00' },
  // 						{ t: 'address', v: tokenHolderInstance.address },
  // 						{ t: 'address', v: '0xdca86553f179820bf7a17b4eb9a9d52fe92013b4' },
  // 						{ t: 'uint8', v: 0 },
  // 						{ t: 'bytes32', v: '0xdca86553f179820bf7a17b4eb9a9d52fe92013b4' },
  // 						{ t: 'uint256', v: ephemeralKeyData[1].toNumber() },
  // 						{ t: 'uint8', v: 0 },
  // 						{ t: 'uint8', v: 0 },
  // 						{ t: 'uint8', v: 0 },
  // 						{ t: 'bytes4', v: '0xdca86553' },
  // 						{ t: 'uint8', v: 0 },
  // 						{ t: 'bytes', v: '' }
  // 				);
  //
  // 		console.log("using web3 utils :- ",msgToBeSignedFromWeb3Utils);
  // 		let signature = await web3.eth.sign(msgToBeSignedFromWeb3Utils, signer);
  //
  // 		signature = signature.slice(2);
  // 		const r = '0x' + signature.slice(0, 64);
  // 		const s = '0x' + signature.slice(64, 128);
  // 		const v = '0x' + signature.slice(128, 130);
  // 		let v_decimal = web3.utils.toDecimal(v) + 27;
  //
  // 		let transaction = await tokenHolderInstance.executeRule(
  // 				tokenHolderInstance.address,
  // 				'0xdca86553f179820bf7a17b4eb9a9d52fe92013b4',
  // 				ephemeralKeyData[1].toNumber(),
  // 				'0xdca86553f179820bf7a17b4eb9a9d52fe92013b4',
  // 				'0xdca86553',
  // 				v_decimal,
  // 				r,
  // 				s
  // 		);
  //
  // 		console.log(JSON.stringify(transaction));
  // 		console.log("Signer :- ",signer);
  // });

  it('should execute rule', async () => {
    let deployer = accounts[0],
      organization = accounts[2],
      coGateway = accounts[6],
      requirement = 1,
      wallet1 = accounts[3],
      wallets = [wallet1],
      receiver = accounts[4],
      ephemeralKey = accounts[5];

    // deploy mock token
    let mockTokenInstance = await mockToken.new({ from: deployer });
    // deploy token rules
    let tokenRulesInstance = await tokenRules.new(organization, mockTokenInstance.address);
    // console.log("token rules :-  " ,tokenRulesInstance.address);
    let transferRuleInstance = await transferRule.new(tokenRulesInstance.address);
    // console.log("transfer rule :-  ",transferRuleInstance.address);
    let registerRuleResponse = await tokenRulesInstance.registerRule('TransferRule', transferRuleInstance.address, {
      from: organization
    });
    let tokenHolderInstance = await tokenHolder.new(
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

    let amountToTransfer = new BigNumber(100);
    let encodedData = await transferRuleInstance.contract.transferFrom.getData(
      tokenHolderInstance.address,
      receiver,
      amountToTransfer
    );
    // let encodedData = await transferRuleInstance.methods
    //     .transferFrom(
    // 			tokenHolderInstance.address,
    // 			receiver,
    //         amountToTransfer
    //     )
    //     .encodeABI();
    let callPrefix = encodedData.substring(0, 10);

    let ephemeralKeyData = await tokenHolderInstance.ephemeralKeys.call(ephemeralKey);
    let bigNumberNonce = new BigNumber(ephemeralKeyData[1]),
      ephemeralKeyNonce = bigNumberNonce.add(1).toString(10);

    let executableData = web3.utils.soliditySha3(
      { t: 'bytes', v: '0x19' },
      { t: 'bytes', v: '0x00' },
      { t: 'address', v: tokenHolderInstance.address },
      { t: 'address', v: transferRuleInstance.address },
      { t: 'uint8', v: 0 },
      { t: 'bytes', v: encodedData },
      { t: 'uint256', v: ephemeralKeyNonce },
      { t: 'uint8', v: 0 },
      { t: 'uint8', v: 0 },
      { t: 'uint8', v: 0 },
      { t: 'bytes4', v: callPrefix },
      { t: 'uint8', v: 0 },
      { t: 'bytes', v: '' }
    );

    console.log(
      'tokenHolderInstance.address',
      tokenHolderInstance.address,
      'transferRuleInstance.address',
      transferRuleInstance.address,
      'encodedData',
      encodedData,
      'ephemeralKeyNonce',
      ephemeralKeyNonce,
      'callPrefix',
      callPrefix,
      'executableData',
      executableData
    );
    let signature = await web3.eth.sign(executableData, ephemeralKey);
    signature = signature.slice(2);
    const r = '0x' + signature.slice(0, 64);
    const s = '0x' + signature.slice(64, 128);
    let v = web3.utils.toDecimal('0x' + signature.slice(128, 130)) + 27;
    //transferRuleInstance.transferFrom.call(tokenHolderInstance.address, receiver, 100, );
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
    let transaction123 = await tokenHolderInstance.executeRule(
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
    // let result = await tokenHolderInstance.executeRule(tokenHolderInstance.address,
    // 		transferRuleInstance.address, ephemeralKeyNonce , encodedData, callPrefix, v, r, s, {from: wallet1});
    console.log('result:', result);
    console.log(
      'tokenHolderInstance balance',
      (await mockTokenInstance.balanceOf(tokenHolderInstance.address)).toString(10)
    );
    console.log('receiver balance', (await mockTokenInstance.balanceOf(receiver)).toString(10));
    assert.equal((await mockTokenInstance.balanceOf(tokenHolderInstance.address)).toString(10), 0);
    assert.equal((await mockTokenInstance.balanceOf(receiver)).toString(10), 200);
    assert.equal(await result, true);
  });
};
