"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Categories", href: "/categories" },
  { name: "Products", href: "/products" },
  { name: "Orders", href: "/orders" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='w-64 bg-slate-900 text-white min-h-screen flex flex-col p-4 flex-shrink-0'>
      <div className='mb-8 px-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Admin CMS</h1>
      </div>
      <nav className='flex flex-col gap-1'>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "px-4 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
