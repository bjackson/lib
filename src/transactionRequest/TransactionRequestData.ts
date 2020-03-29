import BN from 'bn.js';
import { TemporalUnit } from '../eac';
import {
  TransactionRequestCore,
  TransactionRequestCoreRawData
} from '../../types/web3-contracts/TransactionRequestCore';

interface TransactionRequestScheduleData {
  claimWindowSize: BN;
  freezePeriod: BN;
  reservedWindowSize: BN;
  temporalUnit: TemporalUnit;
  windowSize: BN;
  windowStart: BN;
}

interface TransactionRequestClaimData {
  claimedBy: string;
  claimDeposit: BN;
  paymentModifier: number;
  requiredDeposit: BN;
}

interface TransactionRequestTransferData {
  callGas: BN;
  callValue: BN;
  gasPrice: BN;
  toAddress: string;
}

interface TransactionRequestMetaData {
  createdBy: string;
  owner: string;
  isCancelled: boolean;
  wasCalled: boolean;
  wasSuccessful: boolean;
}

export interface TransactionRequestPaymentData {
  feeRecipient: string;
  bountyBenefactor: string;
  fee: BN;
  feeOwed: BN;
  bounty: BN;
  bountyOwed: BN;
}

export default class TransactionRequestData {
  public static async from(txRequest: TransactionRequestCore): Promise<TransactionRequestData> {
    const data = await txRequest.methods.requestData().call();

    return new TransactionRequestData(data, txRequest);
  }

  public claimData: TransactionRequestClaimData;
  public meta: TransactionRequestMetaData;
  public paymentData: TransactionRequestPaymentData;
  public schedule: TransactionRequestScheduleData;
  public txData: TransactionRequestTransferData;
  public txRequest: TransactionRequestCore;

  constructor(data: TransactionRequestCoreRawData, txRequest: TransactionRequestCore) {
    if (typeof data === 'undefined' || typeof txRequest === 'undefined') {
      throw new Error('Cannot call the constructor directly.');
    }

    this.txRequest = txRequest;
    this.fill(data);
  }

  public fill(data: TransactionRequestCoreRawData) {
    this.claimData = {
      claimedBy: data[0][0],
      claimDeposit: new BN(data[2][0]),
      paymentModifier: parseInt(data[3][0], 10),
      requiredDeposit: new BN(data[2][14])
    };

    this.meta = {
      createdBy: data[0][1],
      owner: data[0][2],
      isCancelled: data[1][0],
      wasCalled: data[1][1],
      wasSuccessful: data[1][2]
    };

    this.paymentData = {
      feeRecipient: data[0][3],
      bountyBenefactor: data[0][4],
      fee: new BN(data[2][1]),
      feeOwed: new BN(data[2][2]),
      bounty: new BN(data[2][3]),
      bountyOwed: new BN(data[2][4])
    };

    this.schedule = {
      claimWindowSize: new BN(data[2][5]),
      freezePeriod: new BN(data[2][6]),
      reservedWindowSize: new BN(data[2][7]),
      temporalUnit: parseInt(data[2][8], 10),
      windowSize: new BN(data[2][9]),
      windowStart: new BN(data[2][10])
    };

    this.txData = {
      callGas: new BN(data[2][11]),
      callValue: new BN(data[2][12]),
      gasPrice: new BN(data[2][13]),
      toAddress: data[0][5]
    };
  }

  public async refresh() {
    const data = await this.txRequest.methods.requestData().call();

    this.fill(data);
  }
}
