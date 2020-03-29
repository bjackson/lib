import { assert } from 'chai';
import BN from 'bn.js';
import { BlockScaleFetchingService } from '../../src/utils/GasEstimation/BlockScaleFetchingService';
import { EthGasStationFetchingService } from '../../src/utils/GasEstimation/EthGasStationFetchingService';
import { Util } from '../../src';
import { providerUrl } from '../helpers';

describe('Gas Price Estimation Tests', async () => {
  const gasPriceValues = ['average', 'fast', 'fastest', 'safeLow'];
  const web3 = Util.getWeb3FromProviderUrl(providerUrl);

  describe('BlockScaleFetchingService', async () => {
    const blockscale = new BlockScaleFetchingService();
    const result = await blockscale.fetchGasPrice();

    Object.keys(result).forEach(field => {
      assert.isTrue(result[field] instanceof BN, `${field} is not a BN!`);
    });

    gasPriceValues.forEach(value => {
      assert.isTrue(new BN(result[value]).gt(new BN(web3.utils.toWei('0.05', 'gwei'))));
    });

    assert.isTrue(result.safeLow.lte(result.average));
    assert.isTrue(result.average.lte(result.fast));
    assert.isTrue(result.fast.lte(result.fastest));
  });

  describe('EthGasStationFetchingService', async () => {
    const ethGasStaion = new EthGasStationFetchingService();

    const result = await ethGasStaion.fetchGasPrice();

    Object.keys(result).forEach(field => {
      assert.isTrue(result[field] instanceof BN, `${field} is not a BN!`);
    });

    gasPriceValues.forEach(value => {
      assert.isTrue(new BN(result[value]).gt(new BN(web3.utils.toWei('0.05', 'gwei'))));
    });

    assert.isTrue(result.safeLow.lte(result.average));
    assert.isTrue(result.average.lte(result.fast));
    assert.isTrue(result.fast.lte(result.fastest));
  });
});
