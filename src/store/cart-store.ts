import {
  ItemOptionInput,
  OrderItemInput,
  TItemOption,
  TItemResponse,
  TOrderItem,
} from '@/lib/graphql/generated/graphql'
import { TCartItem } from '@/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const calculateItemPrice = (
  item: TItemResponse | TOrderItem,
  selectedOptions: TItemOption[],
  amount: number,
): number => {
  const basePrice = item.discountPercent
    ? item.price - (item.price * item.discountPercent) / 100
    : item.price

  const extra = selectedOptions.reduce((sum, o) => sum + (o.extraPrice || 0), 0)

  return (basePrice + extra) * amount
}

export const getCartKey = (itemId: string, options: TItemOption[]) =>
  `${itemId}|${normalizeOptions(options)}`

export const convertCartToOrderItems = (
  cartItems: TCartItem[],
): OrderItemInput[] => {
  return cartItems.map(({ amount, itemId, note, selectedOptions }) => ({
    amount,
    itemId,
    note,
    selectedOptions: selectedOptions?.map((o) => ({
      group: o.group,
      name: o.name,
      extraPrice: o.extraPrice || 0,
    })),
  }))
}

const normalizeOptions = (options: TItemOption[]) =>
  options
    .slice()
    .sort(
      (a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name),
    )
    .map((o) => `${o.group}:${o.name}:${o.extraPrice ?? 0}`)
    .join('|')

type TCartStoreState = {
  listCartItem: TCartItem[]
  cartAmount: number
}

type TCartStoreAction = {
  addToCart: (
    item: TItemResponse,
    selectedOptions: ItemOptionInput[],
    amount: number,
    note?: string,
  ) => void
  removeFromCart: (itemId: string, selectedOptions?: ItemOptionInput[]) => void
  updateCartItem: (
    itemId: string,
    selectedOptions: ItemOptionInput[],
    payload: Partial<Omit<OrderItemInput, 'itemId'>>,
  ) => void
  clearCart: () => void
  getTotalCartPrice: () => number
}

const useCartStore = create<TCartStoreState & TCartStoreAction>()(
  persist(
    (set, get) => ({
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
          const key = getCartKey(item.itemId, selectedOptions)
          const newList = [...state.listCartItem]

          const existingIndex = newList.findIndex(
            (c) => getCartKey(c.itemId, c.selectedOptions || []) === key,
          )

          if (existingIndex !== -1) {
            newList[existingIndex].amount += amount
            if (note) {
              newList[existingIndex].note = note
            }
          } else {
            newList.push({
              itemId: item.itemId,
              selectedOptions,
              amount,
              note,
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
      removeFromCart: (itemId: string, selectedOptions?: ItemOptionInput[]) => {
        set((state) => {
          const newList = state.listCartItem.filter((c) => {
            if (!selectedOptions) return c.itemId !== itemId
            return (
              getCartKey(c.itemId, c.selectedOptions || []) !==
              getCartKey(itemId, selectedOptions)
            )
          })

          return {
            listCartItem: newList,
            cartAmount: newList.reduce((sum, cart) => sum + cart.amount, 0),
          }
        })
      },

      /** UPDATE ITEM */
      updateCartItem: (
        itemId: string,
        selectedOptions: ItemOptionInput[],
        payload: Partial<Omit<OrderItemInput, 'itemId'>>,
      ) => {
        set((state) => {
          const newList = state.listCartItem.map((c) =>
            getCartKey(c.itemId, c.selectedOptions || []) ===
            getCartKey(itemId, selectedOptions)
              ? { ...c, ...payload }
              : c,
          )

          return {
            listCartItem: newList,
            cartAmount: newList.reduce((sum, cart) => sum + cart.amount, 0),
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

      getTotalCartPrice: () => {
        return get().listCartItem.reduce((total, item) => {
          return (
            total +
            calculateItemPrice(
              item.itemInfo,
              item.selectedOptions || [],
              item.amount,
            )
          )
        }, 0)
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
