"use client";

import { CheckCircleFilled } from "@ant-design/icons";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center p-4 text-center'>
      <div className='text-green-500 mb-6'>
        <CheckCircleFilled style={{ fontSize: 80 }} />
      </div>
      <h1 className='text-4xl font-bold mb-4'>Order Placed!</h1>
      <p className='text-xl text-gray-500 mb-8 max-w-md'>
        Thank you for your purchase. We are processing your order and will send you a confirmation
        email shortly.
      </p>
      <Link
        href='/'
        className='bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-900 transition-colors'
      >
        Return to Home
      </Link>
    </div>
  );
}
