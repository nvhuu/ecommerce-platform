"use client";

import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/auth-provider";
import { MenuOutlined, SearchOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        {/* Mobile Menu Button */}
        <button className='md:hidden p-2' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <MenuOutlined style={{ fontSize: 24 }} />
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
            <SearchOutlined style={{ fontSize: 20 }} />
          </button>

          {user ? (
            <div className='relative group'>
              <button className='p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2'>
                <UserOutlined style={{ fontSize: 20 }} />
                <span className='text-xs font-medium hidden md:inline-block'>
                  {user.email?.split("@")[0]}
                </span>
              </button>
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block'>
                <div className='px-4 py-2 text-xs text-gray-500 border-b'>
                  Signed in as <br />{" "}
                  <span className='font-medium text-gray-900'>{user.email}</span>
                </div>
                <Link
                  href='/profile'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                >
                  Your Profile
                </Link>
                <Link
                  href='/account/orders'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                >
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link href='/login' className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
              <UserOutlined style={{ fontSize: 20 }} />
            </Link>
          )}
          <button
            className='p-2 hover:bg-gray-100 rounded-full transition-colors relative'
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingOutlined style={{ fontSize: 20 }} />
            {cartCount > 0 && (
              <span className='absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full'>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-b overflow-hidden'>
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
        </div>
      )}
    </nav>
  );
}
