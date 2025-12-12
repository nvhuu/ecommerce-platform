"use client";

import { Sidebar } from "@/components/Sidebar";
import { Layout, theme } from "antd";

const { Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Breadcrumb or Title placeholder */}
          <span className='font-semibold text-lg'>Dashboard</span>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Layout.Footer style={{ textAlign: "center" }}>
          Ecommerce Admin ©{new Date().getFullYear()} Created with Ant Design
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
