/*
 * @description: 包裹连接钱包组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 23:08:43
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-20 15:20:07
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
  // https://api.devnet.solana.com
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
