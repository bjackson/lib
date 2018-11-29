import Web3 = require('web3');
import { Util } from '..';
import RequestFactoryABI from '../abi/RequestFactory';
import { RequestFactory as RequestFactoryContract } from '../../types/web3-contracts/RequestFactory';
import { EventEmitter } from 'events';
import { EventLog } from 'web3/types';
import { TemporalUnit } from '../eac';

export default class RequestFactory {
  public instance: RequestFactoryContract;
  private web3: Web3;

  constructor(address: string, web3: Web3) {
    const util = new Util(web3);

    if (!util.isNotNullAddress(address)) {
      throw new Error('Attempted to instantiate a RequestFactory class from a null address.');
    }

    this.web3 = web3;
    this.instance = new this.web3.eth.Contract(
      RequestFactoryABI,
      address
    ) as RequestFactoryContract;
  }

  get address() {
    return this.instance._address;
  }

  public isKnownRequest(requestAddress: string): Promise<boolean> {
    return this.instance.methods.isKnownRequest(requestAddress).call();
  }

  public watchRequestCreatedLogs(
    filter = {},
    fromBlock = 1,
    callback: (error: any, log: EventLog) => void
  ): EventEmitter {
    return this.instance.events.RequestCreated({ filter, fromBlock }, callback);
  }

  public async stopWatch(event: EventEmitter) {
    event.removeAllListeners();
  }

  public async watchRequestsByBucket(bucket: number, callback: any) {
    return this.watchRequestCreatedLogs(
      {
        bucket
      },
      1,
      // tslint:disable
      (_error: any, log: EventLog) => {
        //tslint:enable
        if (log) {
          callback({
            address: log.returnValues.request,
            params: log.returnValues.params
          });
        }
      }
    );
  }

  // Assume the temporalUnit is blocks if not timestamp.
  public calcBucket(windowStart: number, temporalUnit: TemporalUnit) {
    let bucketSize = 240; // block bucketsize
    let sign = -1; // block sign

    if (temporalUnit === TemporalUnit.TIME) {
      bucketSize = 3600; // timestamp bucketsize
      sign = 1; // timestamp sign
    }

    return sign * (windowStart - (windowStart % bucketSize));
  }
}