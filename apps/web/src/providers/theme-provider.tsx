"use client";

import { ConfigProvider, ThemeConfig } from "antd";
import React from "react";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff",
    borderRadius: 8,
    fontFamily: "var(--font-geist-sans)",
  },
  components: {
    Button: {
      fontWeight: 500,
    },
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
