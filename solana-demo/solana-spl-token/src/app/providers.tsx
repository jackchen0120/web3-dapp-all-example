/*
 * @description: 包裹连接钱包组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 23:08:43
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-09 23:57:54
 */
"use client";

import { ReactNode, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl } from "@solana/web3.js";
import dynamic from "next/dynamic";

const WalletModalProvider = dynamic(async () => (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider, {
  ssr: false,
});

export function Providers({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })], [network]);
  // 注册免费的RPC节点：https://www.helius.dev/solana-rpc-nodes
  return (
    <ConnectionProvider endpoint={"https://devnet.helius-rpc.com/?api-key=777d85c0-fefd-42a0-b290-8b1b3704fe90"}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
