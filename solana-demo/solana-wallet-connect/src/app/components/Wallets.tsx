"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { WalletMultiButton, WalletDisconnectButton, WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
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
  // 定义网络
  const network = WalletAdapterNetwork.Devnet;
  // 获取网络的RPC节点
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const connection = new Connection(clusterApiUrl(network));

  // console.log("连接网络", connection);
  // console.log("rpc节点", endpoint);
  // console.log("网络类型", network);
  // endpoint：https://api.devnet.solana.com
  // network：devnet
  // 钱包
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

  // Wallet 组件1
  const WalletOne = () => {
    // 连接对象
    const { connection } = useConnection();
    // 公钥对象
    const { publicKey } = useWallet();
    // 钱包余额
    const [balance, setBalance] = useState(0);

    useEffect(() => {
      const updateBalance = async () => {
        if (!connection || !publicKey) {
          console.error("Wallet not connected or connection unavailable");
          return;
        }

        try {
          // 监听钱包余额变化
          connection.onAccountChange(
            publicKey,
            (updateAccountInfo) => {
              setBalance(updateAccountInfo.lamports / LAMPORTS_PER_SOL);
            },
            {
              commitment: "confirmed",
            }
          );

          // 获取钱包余额
          const accountInfo = await connection.getAccountInfo(publicKey);

          if (accountInfo) {
            setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
          } else {
            throw new Error("Account info not found");
          }
        } catch (error) {
          console.error("Failed to retrieve account info:", error);
        }
      };

      updateBalance();
    }, [connection, publicKey]);

    return (
      <div className="flex flex-col gap-2">
        <WalletMultiButton />
        <WalletDisconnectButton />
        <p>{publicKey ? `Balance: ${balance} SOL` : ""}</p>
      </div>
    );
  };

  // Send Sol 组件
  const SendSol = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [recipientAddress, setRecipientAddress] = useState("");
    const [amount, setAmount] = useState(0);

    const sendTx = async () => {
      if (!connection || !publicKey || !recipientAddress || !amount) {
        console.error("Wallet not connected or connection unavailable");
        return;
      }

      // 接收地址
      const recipientPublicKey = new PublicKey(recipientAddress);

      // 创建交易&添加指令
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      try {
        // 发送交易
        const signature = await sendTransaction(transaction, connection);
        console.log("Transaction signature:", signature);
      } catch (error) {
        console.error("Failed to send transaction:", error);
      }
    };

    if (!publicKey) {
      return <p>Please connect your wallet first</p>;
    }

    return (
      <div className="flex flex-col gap-2">
        <input
          className="border border-gray-300 rounded-md p-2 dark:text-black"
          type="text"
          placeholder="Recipient Address"
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-md p-2 dark:text-black"
          type="number"
          placeholder="Amount (SOL)"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-md" onClick={sendTx}>
          Send SOL
        </button>
      </div>
    );
  };

  // Wallet组件2
  // const WalletTwo = () => {
  //   const { connection } = useConnection();
  //   const { publicKey } = useWallet();
  //   const [balance, setBalance] = useState(0);

  //   useEffect(() => {
  //     console.log("publicKey", publicKey?.toBase58());
  //     const getBalance = async () => {
  //       if (!connection || !publicKey) {
  //         console.error("Wallet not connected or connection unavailable");
  //         return;
  //       };
  //       const balance = await connection.getBalance(publicKey);
  //       setBalance(balance);
  //       console.log(`钱包余额：${balance / LAMPORTS_PER_SOL} SOL`);
  //       return balance;
  //     };

  //     getBalance();
  //   }, [connection, publicKey]);

  //   if (!publicKey) return null;

  //   // 实时监听余额变化
  //   connection.onAccountChange(publicKey, (updatedAccountInfo) => {
  //     console.log("余额变化", updatedAccountInfo, updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
  //     setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
  //   }, {
  //     commitment: "confirmed",
  //   });

  //   return (
  //     <div className="flex flex-col gap-2">
  //       <div>
  //         <b>地址：</b>
  //         {publicKey?.toBase58()}
  //       </div>
  //       <div>
  //         <b>余额：</b>
  //         {balance / LAMPORTS_PER_SOL} SOL
  //       </div>
  //     </div>
  //   );
  // };

  // useEffect(() => {
  //   console.log("window.solana & window.solflare", window.solana, window.solflare);
  //   if (window.solana && window.solana.isPhantom && window.solflare) {
  //     console.log("Phantom Wallet is available");

  //     window.solana.on("connect", (publicKey: string) => {
  //       console.log("Wallet connected:", publicKey);
  //     });

  //     window.solana.on("disconnect", () => {
  //       console.log("Wallet disconnected");
  //     });

  //     // 检查钱包是否已经连接
  //     async function checkConnection() {
  //       const isConnected = window.solana.publicKey !== null && window.solflare.publicKey !== undefined;
  //       if (isConnected) {
  //         console.log("Wallet is already connected");
  //       } else {
  //         console.log("Wallet is not connected");
  //       }
  //     }

  //     checkConnection();
  //   } else {
  //     console.log("Phantom Wallet is not installed");
  //   }
  // });

  return (
    <div suppressHydrationWarning>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
              <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <WalletOne />
                <SendSol />
              </div>
            </div>
            {/* <div className="flex items-center flex-col gap-5">
              <WalletTwo />
              <div className="flex flex-col gap-2">
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
            </div> */}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}
