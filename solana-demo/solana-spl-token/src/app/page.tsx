"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "./components/ConnectWalletButton";
import Tabs from "./components/Tabs";
import TokenList from "./components/TokenList";
import CreateTokenForm from "./components/CreateTokenForm";
import CreateAtaForm from "./components/CreateAtaForm";
import MintTokenForm from "./components/MintTokenForm";

export default function Home() {
  const { connected, publicKey } = useWallet();

  const tabItems = [
    { label: "代币列表", content: <TokenList /> },
    { label: "创建代币", content: <CreateTokenForm /> },
    { label: "创建关联账户", content: <CreateAtaForm /> },
    { label: "铸造代币", content: <MintTokenForm /> },
  ];

  return (
    <main className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Solana SPL 代币管理</h1>
      <ConnectWalletButton />
      {connected && publicKey && (
        <>
          <p className="mb-1 mt-4 text-gray-400 md:text-base text-xs">
            当前钱包地址：<span className="text-green-300">{publicKey.toBase58()}</span>
          </p>
          <Tabs tabs={tabItems} />
        </>
      )}
    </main>
  );
}
