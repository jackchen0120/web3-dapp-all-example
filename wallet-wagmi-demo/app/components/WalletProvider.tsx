/*
 * @description: WalletProvider组件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-09 00:17:09
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-09 00:36:10
 */
"use client";

// 1. 导入相关依赖项
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/configs/wallet";

// 2. 设置一个查询客户端
const queryClient = new QueryClient();

// 3. 创建一个自定义的WalletProvider组件
export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}