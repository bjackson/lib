import BN from 'bn.js';

export interface ITransactionRequest extends ITransactionRequestPending {
  address: string;
  callValue: BN;
  cancelData: string;
  claimedBy: string;
  claimWindowSize: BN;
  fee: BN;
  owner: string;
  requiredDeposit: BN;
  toAddress: string;
  claimData: string;
  executeData: string;
  bounty: BN;
  callGas: BN;
  gasPrice: BN;
  isCancelled: boolean;
  isClaimed: boolean;
  wasCalled: boolean;
  executionWindowEnd: BN;
  temporalUnit: number;
  claimWindowStart: BN;
  wasSuccessful: boolean;
  windowStart: BN;
  windowSize: BN;
  freezePeriod: BN;
  reservedWindowSize: BN;
  claimWindowEnd: BN;
  freezePeriodEnd: BN;
  reservedWindowEnd: BN;

  afterExecutionWindow(): Promise<boolean>;
  callData(): Promise<string[]>;
  executedAt(): Promise<number>;
  fillData(): Promise<void>;
  refreshData(): Promise<void>;
  claimPaymentModifier(): Promise<BN>;
  inReservedWindow(): Promise<boolean>;
  beforeClaimWindow(): Promise<boolean>;
  inClaimWindow(): Promise<boolean>;
  inFreezePeriod(): Promise<boolean>;
  inExecutionWindow(): Promise<boolean>;
  now(): Promise<BN>;
  isClaimedBy(address: string): boolean;
}

export interface ITransactionRequestPending {
  address: string;
  gasPrice: BN;
}

export interface ITransactionRequestRaw {
  address: string;
  params: string[];
}
