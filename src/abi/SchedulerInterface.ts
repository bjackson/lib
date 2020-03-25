import { AbiItem } from "web3/node_modules/web3-utils";

export default [
  {
    constant: false,
    inputs: [
      { name: '_toAddress', type: 'address' },
      { name: '_callData', type: 'bytes' },
      { name: '_uintArgs', type: 'uint256[8]' }
    ],
    name: 'schedule',
    outputs: [{ name: '', type: 'address' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_bounty', type: 'uint256' },
      { name: '_fee', type: 'uint256' },
      { name: '_callGas', type: 'uint256' },
      { name: '_callValue', type: 'uint256' },
      { name: '_gasPrice', type: 'uint256' }
    ],
    name: 'computeEndowment',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
] as AbiItem[];
