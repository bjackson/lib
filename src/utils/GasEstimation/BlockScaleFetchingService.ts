import fetch from 'node-fetch';
import { IGasPriceFetchingService, BlockScaleInfo } from '../GasPriceUtil';
import BN from 'bn.js';

export class BlockScaleFetchingService implements IGasPriceFetchingService {
  private apiAddress = 'https://dev.blockscale.net/api/gasexpress.json';

  public async fetchGasPrice(): Promise<BlockScaleInfo> {
    const response = await fetch(this.apiAddress);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const json = await response.json();

    const toWei = (val: number): number => {
      const gwei = 1000000000;
      return val * gwei;
    };

    return {
      average: new BN(toWei(json.standard)),
      fast: new BN(toWei(json.fast)),
      fastest: new BN(toWei(json.fastest)),
      safeLow: new BN(toWei(json.safeLow))
    };
  }
}
