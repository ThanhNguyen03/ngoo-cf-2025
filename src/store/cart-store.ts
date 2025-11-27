import {
  TItemOption,
  TItemResponse,
  TOrderItem,
} from '@/lib/graphql/generated/graphql'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type TCartStoreState = {
  listCartItem: TOrderItem[]
}

type TCartStoreAction = {
  addToCart: (item: TOrderItem) => void
  removeFromCart: (itemName: string) => void
  updateCartItem: (item: TOrderItem) => void
  clearCart: () => void
}

export const calculateItemPrice = (
  item: TItemResponse,
  selectedOptions: TItemOption[],
  amount: number,
): number => {
  const basePrice = item.discountPercent
    ? item.price - (item.price * item.discountPercent) / 100
    : item.price
  const extra = selectedOptions.reduce((sum, o) => sum + (o.extraPrice || 0), 0)
  return (basePrice + extra) * amount
}

const useCartStore = create<TCartStoreState & TCartStoreAction>()(
  persist(
    (set) => ({
      listCartItem: [],

      addToCart: (item: TOrderItem) => {
        set((state) => {
          const newList = [...state.listCartItem, item]
          return {
            listCartItem: newList,
          }
        })
      },

      removeFromCart: (itemName: string) => {
        set((state) => {
          const newList = state.listCartItem.filter(
            (item) => item.name !== itemName,
          )
          return {
            listCartItem: newList,
          }
        })
      },

      updateCartItem: (item: TOrderItem) => {
        set((state) => {
          const newList = state.listCartItem.map((i) =>
            i.name === item.name ? item : i,
          )
          return {
            listCartItem: newList,
          }
        })
      },

      clearCart: () => {
        set({ listCartItem: [] })
      },
    }),
    {
      name: 'cart-storage', // key lưu trong localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        listCartItem: state.listCartItem,
      }),
    },
  ),
)

export default useCartStore
