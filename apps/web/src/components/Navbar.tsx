"use client";

import { Menu, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='text-xl font-bold tracking-tight'>STORE</span>
          </Link>
          <nav className='hidden md:flex gap-6 text-sm font-medium'>
            <Link href='/' className='transition-colors hover:text-black/80 text-black/60'>
              Home
            </Link>
            <Link href='/products' className='transition-colors hover:text-black/80 text-black/60'>
              Products
            </Link>
            <Link href='#' className='transition-colors hover:text-black/80 text-black/60'>
              New Arrivals
            </Link>
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <button className='p-2 hover:bg-gray-100 rounded-full'>
            <Search className='w-5 h-5' />
          </button>
          <button className='p-2 hover:bg-gray-100 rounded-full relative'>
            <ShoppingCart className='w-5 h-5' />
            <span className='absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center'>
              0
            </span>
          </button>
          <button
            className='md:hidden p-2 hover:bg-gray-100 rounded-full'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className='w-5 h-5' />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className='md:hidden border-t p-4 space-y-4 bg-white'>
          <Link href='/' className='block text-sm font-medium'>
            Home
          </Link>
          <Link href='/products' className='block text-sm font-medium'>
            Products
          </Link>
          <Link href='#' className='block text-sm font-medium'>
            New Arrivals
          </Link>
        </div>
      )}
    </header>
  );
}
