// ABI for NgooPayment.sol payOrder function
// Confirmed from ngoo-contract/contracts/NgooPayment.sol:91-121
// payOrder is payable — msg.value must equal the `amount` parameter exactly.
export const NGOO_PAYMENT_ABI = [
  {
    name: 'payOrder',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'orderId', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
      { name: 'deadline', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
  },
] as const
