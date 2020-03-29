import { assert } from 'chai';
import BN from 'bn.js';
import { Util, GasPriceUtil } from '../../src';
import { providerUrl } from '../helpers';

describe('Gas Price Util Unit Tests', async () => {
  const web3 = Util.getWeb3FromProviderUrl(providerUrl);

  const util: GasPriceUtil = new GasPriceUtil(web3);

  describe('networkGasPrice()', () => {
    it('returns a number', async () => {
      const networkGasPrice = await util.networkGasPrice();
      assert.isTrue(networkGasPrice.gtn(0));
    });
  });

  describe('getAdvancedNetworkGasPrice()', () => {
    it('returns an object containing BN', async () => {
      const advNetworkGasPrice = await util.getAdvancedNetworkGasPrice();
      const expectedFields = ['average', 'fast', 'fastest', 'safeLow'];

      expectedFields.forEach(field => {
        assert.isTrue(advNetworkGasPrice[field].gt(new BN(web3.utils.toWei('0.05', 'gwei'))));
      });
    });
  });
});
