'use client'

import { NGOO_PAYMENT_ABI } from '@/lib/contracts/ngoo-payment-abi'
import { TCryptoPaymentProof } from '@/lib/graphql/generated/graphql'
import { createLogger } from '@/lib/logger'
import { handleError } from '@/utils'
import { useCallback } from 'react'
import { useChainId, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

const logger = createLogger('CryptoPayment')

type TUseCryptoPaymentReturn = {
  sendPayment: (proof: TCryptoPaymentProof) => Promise<void>
  isPending: boolean    // Waiting for user to confirm in wallet
  isConfirming: boolean // Waiting for on-chain confirmation
  txHash: `0x${string}` | undefined
  isSuccess: boolean
  error: Error | null
  reset: () => void
}

// Handles the on-chain payment step for crypto orders.
// Receives TCryptoPaymentProof from the BE (created during order creation),
// switches to the required chain if needed, then calls payOrder on the contract.
//
// Flow: createOrder → get proof → sendPayment(proof) → tx confirmed → redirect
export const useCryptoPayment = (): TUseCryptoPaymentReturn => {
  const currentChainId = useChainId()
  const { switchChainAsync } = useSwitchChain()

  const {
    writeContractAsync,
    data: txHash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash: txHash })

  const sendPayment = useCallback(
    async (proof: TCryptoPaymentProof) => {
      try {
        // Switch to the chain specified in the proof if user is on a different one
        if (currentChainId !== proof.chainId) {
          await switchChainAsync({ chainId: proof.chainId })
        }

        logger.info({ chainId: proof.chainId, amount: proof.amount }, 'Sending crypto payment')

        const hash = await writeContractAsync({
          address: proof.contractAddress as `0x${string}`,
          abi: NGOO_PAYMENT_ABI,
          functionName: 'payOrder',
          args: [
            proof.orderIdHash as `0x${string}`,  // bytes32 orderId hash
            BigInt(proof.amount),                  // uint256 amount in wei
            proof.nonce as `0x${string}`,          // bytes32 nonce
            BigInt(proof.deadline),                // uint256 deadline timestamp
            proof.signature as `0x${string}`,      // bytes signature from BE
          ],
          // payable — msg.value must equal amount exactly
          value: BigInt(proof.amount),
        })
        logger.info({ txHash: hash }, 'Transaction submitted')
      } catch (err) {
        // handleError already shows a toast — no second toast.error() needed
        handleError(err, 'useCryptoPayment: sendPayment failed')
      }
    },
    [currentChainId, switchChainAsync, writeContractAsync],
  )

  return {
    sendPayment,
    isPending,
    isConfirming,
    txHash,
    isSuccess,
    error: (writeError ?? receiptError) as Error | null,
    reset,
  }
}
