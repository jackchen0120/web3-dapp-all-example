"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { WalletMultiButton, WalletDisconnectButton, WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from "next/dynamic";

// 动态导入钱包组件
const WalletMultiButton = dynamic(async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton, {
  ssr: false,
});

const WalletDisconnectButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
  { ssr: false }
);

const WalletModalProvider = dynamic(async () => (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider, {
  ssr: false,
});

export default function Wallets() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const connection = new Connection(clusterApiUrl(network));

  // console.log("连接网络", connection);
  // console.log("rpc节点", endpoint);
  // console.log("网络类型", network);
  // endpoint：https://api.devnet.solana.com
  // network：devnet

  const wallets = useMemo(
    () => [
      // new SolflareWalletAdapter(),
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
    ],
    []
  );

  // 创建一个新的组件来处理余额显示
  const WalletBalance = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
      console.log("publicKey", publicKey?.toBase58());
      const getBalance = async () => {
        if (!publicKey) return;
        const balance = await connection.getBalance(publicKey);
        setBalance(balance);
        console.log(`钱包余额：${balance / LAMPORTS_PER_SOL} SOL`);
        return balance;
      };

      getBalance();
    }, [connection, publicKey]);

    if (!publicKey) return null;

    // 实时监听余额变化
    connection.onAccountChange(publicKey, (updatedAccountInfo) => {
      console.log("余额变化", updatedAccountInfo, updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
    });

    return (
      <div className="flex flex-col gap-2">
        <div>
          <b>地址：</b>
          {publicKey?.toBase58()}
        </div>
        <div>
          <b>余额：</b>
          {balance / LAMPORTS_PER_SOL} SOL
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log("window.solana & window.solflare", window.solana, window.solflare);
    if (window.solana && window.solana.isPhantom && window.solflare) {
      console.log("Phantom Wallet is available");

      window.solana.on("connect", (publicKey: string) => {
        console.log("Wallet connected:", publicKey);
      });

      window.solana.on("disconnect", () => {
        console.log("Wallet disconnected");
      });

      // 检查钱包是否已经连接
      async function checkConnection() {
        const isConnected = window.solana.publicKey !== null && window.solflare.publicKey !== undefined;
        if (isConnected) {
          console.log("Wallet is already connected");
        } else {
          console.log("Wallet is not connected");
        }
      }

      checkConnection();
    } else {
      console.log("Phantom Wallet is not installed");
    }
  });

  return (
    <div suppressHydrationWarning>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="flex items-center flex-col gap-5">
              <WalletBalance />
              <div>
                <WalletMultiButton />
              </div>
              <div>
                <WalletDisconnectButton />
              </div>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}
