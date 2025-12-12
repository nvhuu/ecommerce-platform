"use client";

import { useCart } from "@/providers/CartProvider";
// @ts-ignore
import { AnimatePresence, motion } from "framer-motion";
// @ts-ignore
import { Minus, Plus, Trash2, X } from "lucide-react";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className='fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm'
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className='fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col'
          >
            <div className='p-4 border-b flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Shopping Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className='p-2 hover:bg-gray-100 rounded-full'
              >
                <X size={20} />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              {cart.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-gray-500 space-y-4'>
                  <ShoppingBag size={48} className='opacity-20' />{" "}
                  {/* Need to import ShoppingBag */}
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className='flex gap-4'>
                    <div className='w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 relative overflow-hidden'>
                      {/* Placeholder for image if not present */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className='object-cover w-full h-full'
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-200' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium'>{item.name}</h3>
                      <p className='text-sm text-gray-500'>${item.price.toFixed(2)}</p>
                      <div className='flex items-center gap-2 mt-2'>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className='p-1 border rounded hover:bg-gray-50'
                        >
                          <Minus size={14} />
                        </button>
                        <span className='text-sm w-4 text-center'>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className='p-1 border rounded hover:bg-gray-50'
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className='text-gray-400 hover:text-red-500 self-start'
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className='p-4 border-t bg-gray-50'>
              <div className='flex justify-between mb-4 text-lg font-semibold'>
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                className='w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors'
              >
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// @ts-ignore
import { ShoppingBag } from "lucide-react";
