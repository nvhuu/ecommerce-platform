"use client";

import {
  AppstoreOutlined,
  DashboardOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

const navItems = [
  { name: "Dashboard", href: "/", icon: <DashboardOutlined /> },
  { name: "Categories", href: "/categories", icon: <AppstoreOutlined /> },
  { name: "Products", href: "/products", icon: <ShoppingOutlined /> },
  { name: "Orders", href: "/orders", icon: <ShoppingCartOutlined /> },
  { name: "Users", href: "/users", icon: <UserOutlined /> },
  { name: "Settings", href: "/settings", icon: <SettingOutlined /> },
];

export function Sidebar() {
  const pathname = usePathname();

  // Determine selected key
  const selectedKey =
    navItems.find((item) => item.href !== "/" && pathname.startsWith(item.href))?.href ||
    (pathname === "/" ? "/" : "");

  return (
    <Sider width={250} theme='dark' className='min-h-screen'>
      <div className='flex items-center justify-center h-16 bg-rgba(255,255,255,0.1) m-2 rounded-lg'>
        <h1 className='text-white text-xl font-bold tracking-wider m-0'>ADMIN CMS</h1>
      </div>
      <Menu
        theme='dark'
        mode='inline'
        selectedKeys={[selectedKey]}
        items={navItems.map((item) => ({
          key: item.href,
          icon: item.icon,
          label: <Link href={item.href}>{item.name}</Link>,
        }))}
      />
    </Sider>
  );
}
