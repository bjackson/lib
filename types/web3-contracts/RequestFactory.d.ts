/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, EventData, ContractSendMethod } from 'web3-eth-contract';
import { BlockNumber } from 'web3-core';
import { EventEmitter } from 'events';

export class RequestFactory extends Contract {
  methods: {
    validateRequestParams(
      _addressArgs: (string)[],
      _uintArgs: (number | string)[],
      _endowment: number | string
    ): ContractSendMethod<(boolean)[]>;

    isKnownRequest(_address: string): ContractSendMethod<boolean>;

    getBucket(windowStart: number | string, unit: number | string): ContractSendMethod<string>;

    unpause(): ContractSendMethod<void>;

    renounceOwnership(): ContractSendMethod<void>;

    pause(): ContractSendMethod<void>;

    transferOwnership(_newOwner: string): ContractSendMethod<void>;

    createRequest(
      _addressArgs: (string)[],
      _uintArgs: (number | string)[],
      _callData: (string | number[])[]
    ): ContractSendMethod<string>;

    createValidatedRequest(
      _addressArgs: (string)[],
      _uintArgs: (number | string)[],
      _callData: (string | number[])[]
    ): ContractSendMethod<string>;

    TIMESTAMP_BUCKET_SIZE(): ContractSendMethod<string>;
    paused(): ContractSendMethod<boolean>;
    owner(): ContractSendMethod<string>;
    transactionRequestCore(): ContractSendMethod<string>;
    BLOCKS_BUCKET_SIZE(): ContractSendMethod<string>;
  };
  events: {
    ValidationError(
      options?: {
        filter?: object;
        fromBlock?: BlockNumber;
        topics?: (null | string)[];
      },
      cb?: (error: Error, event: EventData) => void
    ): EventEmitter;

    Pause(
      options?: {
        filter?: object;
        fromBlock?: BlockNumber;
        topics?: (null | string)[];
      },
      cb?: (error: Error, event: EventData) => void
    ): EventEmitter;

    Unpause(
      options?: {
        filter?: object;
        fromBlock?: BlockNumber;
        topics?: (null | string)[];
      },
      cb?: (error: Error, event: EventData) => void
    ): EventEmitter;

    OwnershipRenounced(
      options?: {
        filter?: object;
        fromBlock?: BlockNumber;
        topics?: (null | string)[];
      },
      cb?: (error: Error, event: EventData) => void
    ): EventEmitter;

    OwnershipTransferred(
      options?: {
        filter?: object;
        fromBlock?: BlockNumber;
        topics?: (null | string)[];
      },
      cb?: (error: Error, event: EventData) => void
    ): EventEmitter;

    CloneCreated(
      options?: {
        filter?: object;
        fromBlock?: BlockNumber;
        topics?: (null | string)[];
      },
      cb?: (error: Error, event: EventData) => void
    ): EventEmitter;

    RequestCreated(
      options?: {
        filter?: object;
        fromBlock?: BlockNumber;
        topics?: (null | string)[];
      },
      cb?: (error: Error, event: EventData) => void
    ): EventEmitter;

    allEvents: (
      options?: {
        filter?: object;
        fromBlock?: BlockNumber;
        topics?: (null | string)[];
      },
      cb?: (error: Error, event: EventData) => void
    ) => EventEmitter;
  };
}
