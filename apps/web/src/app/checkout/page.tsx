"use client";

import api from "@/lib/api";
import { useCart } from "@/providers/CartProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      // Construct order payload matching API expectations
      const payload = {
        userId: "guest-user-id", // In real app, from auth. For now hardcoded or optional
        totalAmount: cartTotal,
        status: "PENDING",
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // Note: backend might require authentication or a guest checkout endpoint.
      // Assuming /orders is protected, we might need to mock this or rely on the mock auth in api client if set.
      // If /orders is strict, we might fail here.
      // For demo purposes, we will try to post. If it fails due to auth, we'll simulate success.
      return api.post("/orders", payload);
    },
    onSuccess: () => {
      clearCart();
      router.push("/checkout/success");
    },
    onError: (error) => {
      console.error("Checkout validation failed", error);
      // Fallback for demo if API auth blocks us
      // alert("Simulating success for demo (API might require auth)");
      // clearCart();
      // router.push("/checkout/success");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrderMutation.mutate();
  };

  if (cart.length === 0) {
    return (
      <div className='container mx-auto px-4 py-20 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Your cart is empty</h1>
        <p className='mb-8'>Add some products to proceed to checkout.</p>
        <button
          onClick={() => router.push("/products")}
          className='bg-black text-white px-6 py-3 rounded-full font-medium'
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Form */}
        <div>
          <h2 className='text-xl font-semibold mb-6'>Shipping Details</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Full Name</label>
              <input
                required
                type='text'
                className='w-full border p-3 rounded-lg focus:ring-2 focus:ring-black focus:outline-none'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Email</label>
              <input
                required
                type='email'
                className='w-full border p-3 rounded-lg focus:ring-2 focus:ring-black focus:outline-none'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Address</label>
              <input
                required
                type='text'
                className='w-full border p-3 rounded-lg focus:ring-2 focus:ring-black focus:outline-none'
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>City</label>
                <input
                  required
                  type='text'
                  className='w-full border p-3 rounded-lg focus:ring-2 focus:ring-black focus:outline-none'
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>ZIP Code</label>
                <input
                  required
                  type='text'
                  className='w-full border p-3 rounded-lg focus:ring-2 focus:ring-black focus:outline-none'
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                />
              </div>
            </div>

            <div className='mt-8 pt-8 border-t'>
              <h2 className='text-xl font-semibold mb-6'>Payment</h2>
              <div className='bg-gray-50 p-4 rounded-lg border text-sm text-gray-500'>
                Payment gateway integration skipped for this demo. Order will be placed immediately.
              </div>
            </div>

            <button
              type='submit'
              disabled={createOrderMutation.isPending}
              className='w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors mt-6 disabled:opacity-50'
            >
              {createOrderMutation.isPending
                ? "Processing..."
                : `Place Order ($${cartTotal.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className='bg-gray-50 p-6 rounded-xl h-fit'>
          <h2 className='text-xl font-semibold mb-6'>Order Summary</h2>
          <div className='space-y-4'>
            {cart.map((item) => (
              <div key={item.id} className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gray-200 rounded overflow-hidden'>
                    {item.image ? (
                      <img src={item.image} className='w-full h-full object-cover' />
                    ) : null}
                  </div>
                  <div>
                    <p className='font-medium text-sm'>{item.name}</p>
                    <p className='text-gray-500 text-xs text-sm'>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className='font-medium'>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className='border-t mt-6 pt-4 space-y-2'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Shipping</span>
              <span>Free</span>
            </div>
            <div className='flex justify-between font-bold text-lg border-t pt-2 mt-2'>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
