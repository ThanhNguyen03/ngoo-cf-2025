'use client'

import { EBehaviorEvent, TrackBehaviorDocument } from '@/lib/graphql/generated/graphql'
import { createLogger } from '@/lib/logger'
import { useMutation } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { useCallback, useRef } from 'react'

const logger = createLogger('TrackBehavior')

/**
 * Hook to track user behavior events (VIEW, ADD_TO_CART) for the recommendation engine.
 *
 * Only fires for authenticated users — anonymous behavior is not tracked on the FE
 * (the recommendation engine serves anonymous users from hot-search + best-seller caches).
 *
 * VIEW deduplication: A per-render `sentRef` Set prevents the same VIEW event from
 * being sent more than once within the current component lifecycle. The server also
 * enforces a 30-second Redis dedup window per user+item to handle remounts.
 *
 * PURCHASE events are tracked server-side in the order resolver — not from the FE —
 * to prevent spoofing.
 */
export const useTrackBehavior = () => {
  const { data: session } = useSession()
  const [trackMutation] = useMutation(TrackBehaviorDocument)
  // Dedup VIEW events within the same component lifecycle to avoid duplicate calls
  // on React StrictMode double-invocation or quick re-renders.
  const sentRef = useRef<Set<string>>(new Set())

  const track = useCallback(
    (itemId: string, event: EBehaviorEvent) => {
      // Only track authenticated users — skip silently for guests
      if (!session?.accessToken) return

      const key = `${itemId}:${event}`
      if (event === EBehaviorEvent.View && sentRef.current.has(key)) return
      sentRef.current.add(key)

      trackMutation({ variables: { input: { itemId, event } } }).catch((err) =>
        logger.debug({ err }, 'Behavior track failed'),
      )
    },
    [session?.accessToken, trackMutation],
  )

  return { track }
}
