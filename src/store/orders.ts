import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import { TOrder } from '../types/types';

interface ICartState {
  orders: TOrder[];
  removeItem: (id: number) => void;
  clearCart: () => void;
  addItem: (order: TOrder) => void;
}

export const useCartStore = create(persist<ICartState>(
  (set) => ({
    orders: [],
    addItem: (order: TOrder) => {
      set((state) => {

        const sameOrder = state.orders.find((item) => item.id === order.id && item.size === order.size)

        if (sameOrder) {
          return {
            orders: [...state.orders.map((item) => {
              if (item.id === order.id && item.size === order.size) {
                return {
                  ...item,
                  count: item.count + order.count,
                }
              }
              return item
            })]
          }
        }

        return {
          orders: [...state.orders, order],
        }
      });
    },
    removeItem: (id) => {
      set((state) => ({
        orders: state.orders.filter((el) => el.id !== id),
      }));
    },
    clearCart: () => {
      set({ orders: [] });
    },
  }),
  {
    name: 'store-cart',
    storage: createJSONStorage(() => sessionStorage),
  }
));