import { expect, assert } from 'chai';
import { Util } from '../../src';
import { providerUrl } from '../helpers';
import BN from 'bn.js';

describe('Util Unit Tests', async () => {
  const web3 = Util.getWeb3FromProviderUrl(providerUrl);

  const util: Util = new Util(web3);

  describe('getAverageBlockTime()', () => {
    it('returns the average blocktime of last 100 blocks', async () => {
      const avgBlockTime = await util.getAverageBlockTime();
      assert.isNumber(avgBlockTime);
      assert.isAbove(avgBlockTime, 0);
    });
  });

  describe('getBlock()', () => {
    it('returns a error when no block found for block number', async () => {
      const blockNumber = 1000000000;
      let err: Error;

      try {
        await util.getBlock(blockNumber);
      } catch (e) {
        err = e;
      }

      expect(err.message).to.equal(`Returned block ${blockNumber} is null`);
    });
  });

  describe('isWatchingEnabled()', () => {
    it('returns true when watching', async () => {
      const watching = await Util.isWatchingEnabled(web3);
      assert.isTrue(watching);
    });
  });

  describe('estimateMaximumExecutionGasPrice()', () => {
    it('estimated gasPrice > current gas price when bounty is higher than costs', () => {
      const bounty = new BN(web3.utils.toWei('0.02', 'ether'));
      const gasPrice = new BN(web3.utils.toWei('2', 'gwei'));
      const callGas = new BN(21000);

      const estimation = Util.estimateMaximumExecutionGasPrice(bounty, gasPrice, callGas);

      assert.isTrue(estimation.gt(gasPrice));
    });

    it('throw error when additional gas price is lower than 0', () => {
      assert.throws(() =>
        Util.estimateMaximumExecutionGasPrice(new BN(1), new BN(1), new BN(-1))
      );
      assert.throws(() =>
        Util.estimateMaximumExecutionGasPrice(new BN(-1), new BN(1), new BN(1))
      );
      assert.throws(() =>
        Util.estimateMaximumExecutionGasPrice(new BN(1), new BN(-1), new BN(1))
      );
    });
  });

  describe('estimateBountyForExecutionGasPrice()', () => {
    it('for 0 additional gasPrice the bounty equals the costs', () => {
      const arbitraryCoefficient = 0.85;
      const paymentModifier = 0.9;

      const gasPrice = new BN(web3.utils.toWei('2', 'gwei'));
      const additionalGasPrice = new BN(0);
      const callGas = new BN(21000);
      const claimingGasAmount = 100000;
      const claimingCost = gasPrice.muln(claimingGasAmount);

      const expectedBounty = claimingCost
        .divn(paymentModifier)
        .divn(arbitraryCoefficient);

      const bounty = Util.estimateBountyForExecutionGasPrice(gasPrice, callGas, additionalGasPrice);

      assert.isTrue(expectedBounty.eq(bounty));
    });

    it('for 10GWei additional gasPrice the bounty is larger by the cost of extra execution gas', () => {
      const arbitraryCoefficient = 0.85;
      const paymentModifier = 0.9;

      const gasPrice = new BN(web3.utils.toWei('2', 'gwei'));
      const additionalGasPrice = new BN(web3.utils.toWei('10', 'gwei'));
      const callGas = new BN(21000);
      const claimingGasAmount = 100000;
      const claimingCost = gasPrice.muln(claimingGasAmount);
      const executionOverheadGasAmount = 180000;

      const additionalGasPriceCost = callGas
        .addn(executionOverheadGasAmount)
        .mul(additionalGasPrice);

      const expectedBounty = claimingCost
        .add(additionalGasPriceCost)
        .divn(paymentModifier)
        .divn(arbitraryCoefficient);

      const bounty = Util.estimateBountyForExecutionGasPrice(gasPrice, callGas, additionalGasPrice);

      assert.isTrue(expectedBounty.eq(bounty));
    });

    it('throw error when additional gas price is lower than 0', () => {
      assert.throws(() =>
        Util.estimateBountyForExecutionGasPrice(
          new BN(1),
          new BN(1),
          new BN(-1)
        )
      );
      assert.throws(() =>
        Util.estimateBountyForExecutionGasPrice(
          new BN(-1),
          new BN(1),
          new BN(1)
        )
      );
      assert.throws(() =>
        Util.estimateBountyForExecutionGasPrice(
          new BN(1),
          new BN(-1),
          new BN(1)
        )
      );
    });
  });
});
