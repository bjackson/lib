import Web3 from 'web3';
import { Util } from '..';
import RequestFactoryABI from '../abi/RequestFactoryABI';
import { RequestFactory as RequestFactoryContract } from '../../types/web3-contracts/RequestFactory';
import { EventEmitter } from 'events';
import { EventLog, BlockNumber } from 'web3-core';
import { Filter } from 'web3-eth-contract';
import { TemporalUnit } from '../eac';
import Constants from '../Constants';


export default class RequestFactory {
  public instance: RequestFactoryContract;
  public util: Util;
  private web3: Web3;

  constructor(address: string, web3: Web3) {
    this.util = new Util(web3);

    if (!this.util.isNotNullAddress(address)) {
      throw new Error('Attempted to instantiate a RequestFactory class from a null address.');
    }

    this.web3 = web3;
    this.instance = new this.web3.eth.Contract(
      RequestFactoryABI,
      address
    ) as RequestFactoryContract;
  }

  get address() {
    return this.instance.options.address;
  }

  public isKnownRequest(requestAddress: string): Promise<boolean> {
    return this.instance.methods.isKnownRequest(requestAddress).call();
  }

  public watchRequestCreatedLogs(
    filter = {},
    fromBlock = 1,
    callback: (error: any, log: EventLog) => void
  ): EventEmitter {
    const options = { filter, fromBlock };

    return this.instance.events.RequestCreated(options);
  }

  public async stopWatch(event: EventEmitter) {
    event.removeAllListeners();
  }

  public async watchRequestsByBucket(bucket: number, callback: any) {
    const startBlock = (await this.util.getRequestFactoryStartBlock()) as number;

    return this.watchRequestCreatedLogs(
      {
        bucket
      },
      startBlock,
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
    let bucketSize = Constants.BUCKET_SIZE.block;
    let sign = -1; // block sign

    if (temporalUnit === TemporalUnit.TIME) {
      bucketSize = Constants.BUCKET_SIZE.timestamp;
      sign = 1; // timestamp sign
    }

    return sign * (windowStart - (windowStart % bucketSize));
  }

  public async getRequestCreatedEvents(
    filter: Filter = {},
    fromBlock: BlockNumber = 'genesis',
    toBlock: BlockNumber = 'latest',
    topics: string[] = []
  ): Promise<any[]> {
    const events = await this.instance.getPastEvents('RequestCreated', {
      filter,
      fromBlock,
      toBlock,
      topics,
    });
    console.log(events);
    return events;
  }

  public async getRequestsByOwner(owner: string, startBlock: BlockNumber, endBlock: BlockNumber) {
    startBlock = startBlock || (await this.util.getRequestFactoryStartBlock());
    endBlock = endBlock || 'latest';

    const events: any[] = await this.getRequestCreatedEvents({ owner }, startBlock, endBlock);
    return events.map(event => event.address);
  }
}
