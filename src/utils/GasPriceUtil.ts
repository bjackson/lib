import BN from 'bn.js';
import Web3 from 'web3';
import { BlockScaleFetchingService } from './GasEstimation/BlockScaleFetchingService';
import { EthGasStationFetchingService } from './GasEstimation/EthGasStationFetchingService';
import { Networks } from './Util';

const GAS_PRICE_FETCHING_SERVICES = {
  [Networks.Mainnet]: [new BlockScaleFetchingService(), new EthGasStationFetchingService()]
};

export interface IGasPriceFetchingService {
  fetchGasPrice(): Promise<GasPriceEstimation>;
}

export type GasPriceEstimation = EthGasStationInfo | BlockScaleInfo;

export interface EthGasStationInfo {
  average: BN;
  avgWait: BN;
  blockTime: BN;
  fast: BN;
  fastWait: BN;
  fastest: BN;
  fastestWait: BN;
  safeLow: BN;
  safeLowWait: BN;
}

export interface BlockScaleInfo {
  average: BN;
  fast: BN;
  fastest: BN;
  safeLow: BN;
}

export default class GasPriceUtil {
  public static async getEthGasStationStats(): Promise<EthGasStationInfo> {
    const ethGasStation = new EthGasStationFetchingService();
    return ethGasStation.fetchGasPrice();
  }

  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  public async networkGasPrice(): Promise<BN> {
    const gasPriceEstimation = await this.externalApiGasPrice();

    return (gasPriceEstimation && gasPriceEstimation.average) || this.getGasPrice();
  }

  public async getAdvancedNetworkGasPrice(): Promise<GasPriceEstimation> {
    try {
      const gasPrices = await this.externalApiGasPrice();
      if (!gasPrices) {
        throw new Error('Could not retrieve gas prices from external source.');
      }
      return gasPrices;
    } catch (e) {
      const fallbackGasPrice = await this.getGasPrice();

      return {
        average: fallbackGasPrice,
        fast: fallbackGasPrice,
        fastest: fallbackGasPrice,
        safeLow: fallbackGasPrice
      };
    }
  }

  public async getGasPrice(): Promise<BN> {
    return new BN(await this.web3.eth.getGasPrice());
  }

  private async externalApiGasPrice(): Promise<GasPriceEstimation> {
    const networkId = await this.web3.eth.net.getId();
    const services = GAS_PRICE_FETCHING_SERVICES[networkId];

    if (!services) {
      return null;
    }

    for (const service of services) {
      try {
        const gasEstimate: GasPriceEstimation = await service.fetchGasPrice();
        if (gasEstimate) {
          return gasEstimate;
        }
      } catch (e) {
        console.error(e);
      }
    }

    return null;
  }
}
