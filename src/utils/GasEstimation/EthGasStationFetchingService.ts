import fetch from 'node-fetch';
import BN from 'bn.js';
import { IGasPriceFetchingService, EthGasStationInfo } from '../GasPriceUtil';

export class EthGasStationFetchingService implements IGasPriceFetchingService {
  // FIXME: Make this public. Downstream libs should be able to modify the endpoint.
  private apiAddress = 'https://ethgasstation.info/json/ethgasAPI.json';

  public async fetchGasPrice(): Promise<EthGasStationInfo> {
    const response = await fetch(this.apiAddress);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const {
      average,
      avgWait,
      block_time,
      fast,
      fastWait,
      fastest,
      fastestWait,
      safeLow,
      safeLowWait
    } = await response.json();

    const toWei = (val: number): number => {
      const gwei = 1000000000;
      return (val * gwei) / 10;
    };

    return {
      average: new BN(toWei(average)),
      avgWait: new BN(avgWait),
      blockTime: new BN(Math.floor(block_time)),
      fast: new BN(toWei(fast)),
      fastWait: new BN(fastWait),
      fastest: new BN(toWei(fastest)),
      fastestWait: new BN(fastestWait),
      safeLow: new BN(toWei(safeLow)),
      safeLowWait: new BN(safeLowWait)
    };
  }
}
