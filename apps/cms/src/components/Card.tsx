import { Card as AntCard, type CardProps } from "antd";
import type { FC, PropsWithChildren } from "react";

// Wrapper to fix type incompatibility between Ant Design v6 and React 19
export const Card: FC<PropsWithChildren<CardProps>> = (props) => {
  // Cast to any to bypass type incompatibility
  const Component = AntCard as unknown as FC<PropsWithChildren<CardProps>>;
  return <Component {...props} />;
};
