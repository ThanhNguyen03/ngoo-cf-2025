import {
  OrderItemInput,
  TItemOption,
  TItemResponse,
} from '@/lib/graphql/generated/graphql'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

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

type TCartItem = OrderItemInput & {
  itemInfo: TItemResponse
}

type TCartStoreState = {
  listCartItem: TCartItem[]
  cartAmount: number
}

type TCartStoreAction = {
  addToCart: (
    item: TItemResponse,
    selectedOptions: TItemOption[],
    amount: number,
    note?: string,
  ) => void
  removeFromCart: (index: number) => void
  updateCartItem: (
    index: number,
    payload: Partial<Omit<OrderItemInput, 'itemId'>>,
  ) => void
  clearCart: () => void
}

const useCartStore = create<TCartStoreState & TCartStoreAction>()(
  persist(
    (set) => ({
      listCartItem: [],
      cartAmount: 0,

      /** ADD TO CART */
      addToCart: (
        item: TItemResponse,
        selectedOptions: TItemOption[],
        amount: number,
        note?: string,
      ) => {
        set((state) => {
          const normalizedOptions = selectedOptions.map((o) => ({
            group: o.group,
            name: o.name,
            extraPrice: o.extraPrice,
          }))

          const existingIndex = state.listCartItem.findIndex((c) => {
            if (c.itemId !== item.itemId) {
              return false
            }

            const addOption = c.selectedOptions || []

            return (
              addOption.length === normalizedOptions.length &&
              addOption.every(
                (add, i) =>
                  add?.group === normalizedOptions[i]?.group &&
                  add?.extraPrice === normalizedOptions[i]?.extraPrice,
              )
            )
          })

          const newList = [...state.listCartItem]

          if (existingIndex !== -1) {
            newList[existingIndex].amount += amount
          } else {
            newList.push({
              itemId: item.itemId,
              amount,
              note,
              selectedOptions: normalizedOptions,
              itemInfo: item,
            })
          }

          return {
            listCartItem: newList,
            cartAmount: newList.reduce((sum, cart) => sum + cart.amount, 0),
          }
        })
      },

      /** REMOVE */
      removeFromCart: (index: number) => {
        set((state) => {
          const newList = state.listCartItem.filter((_, i) => i !== index)
          return {
            listCartItem: newList,
            cartAmount: newList.reduce((s, c) => s + c.amount, 0),
          }
        })
      },

      /** UPDATE ITEM */
      updateCartItem: (
        index: number,
        payload: Partial<Omit<OrderItemInput, 'itemId'>>,
      ) => {
        set((state) => {
          const newList = state.listCartItem.map((item, i) =>
            i === index ? { ...item, ...payload } : item,
          )

          return {
            listCartItem: newList,
            cartAmount: newList.reduce((s, c) => s + c.amount, 0),
          }
        })
      },

      /** CLEAR */
      clearCart: () => {
        set({
          listCartItem: [],
          cartAmount: 0,
        })
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        listCartItem: state.listCartItem,
        cartAmount: state.cartAmount,
      }),
    },
  ),
)

export default useCartStore
