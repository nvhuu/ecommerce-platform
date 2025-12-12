"use client";

import { useCart } from "@/providers/CartProvider";
// @ts-ignore
import { AnimatePresence, motion } from "framer-motion";
// @ts-ignore
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        {/* Mobile Menu Button */}
        <button className='md:hidden p-2' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href='/' className='text-2xl font-bold tracking-tighter'>
          Luxe<span className='text-blue-600'>Store</span>.
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600'>
          <Link href='/' className='hover:text-black transition-colors'>
            Home
          </Link>
          <Link href='/products' className='hover:text-black transition-colors'>
            Shop
          </Link>
          <Link href='/about' className='hover:text-black transition-colors'>
            About
          </Link>
        </div>

        {/* Icons */}
        <div className='flex items-center space-x-4'>
          <button className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <Search size={20} />
          </button>
          <Link href='/login' className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <User size={20} />
          </Link>
          <button
            className='p-2 hover:bg-gray-100 rounded-full transition-colors relative'
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full'
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='md:hidden bg-white border-b overflow-hidden'
          >
            <div className='flex flex-col p-4 space-y-4 text-sm font-medium'>
              <Link href='/' onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href='/products' onClick={() => setIsMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link href='/about' onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
