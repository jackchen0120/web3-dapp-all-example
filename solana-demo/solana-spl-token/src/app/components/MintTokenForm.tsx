/*
 * @description: 铸造代币表单组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 23:20:00
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-10 22:35:35
 */
"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { createMintToInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, Keypair, Transaction } from "@solana/web3.js";
import toast, { Toaster } from "react-hot-toast";

function MintTokenForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [mintAddress, setMintAddress] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!connection || !publicKey || !mintAddress || !recipientAddress || !amount) {
      toast.error("请填写完整信息");
      return;
    }
    setLoading(true);
    try {
      // const mintKeypair = Keypair.generate();
      const mintPubkey = new PublicKey(mintAddress); // 代币Mint地址
      const recipientPubkey = new PublicKey(recipientAddress); // 接收者地址
      // 获取接收者的关联账户地址
      const associatedToken = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);
      const tx = new Transaction().add(
        // 创建铸币指令
        createMintToInstruction(mintPubkey, associatedToken, publicKey, BigInt(Number(amount)))
      );
      const signature = await sendTransaction(tx, connection);
      console.log(`铸币成功，交易签名：${signature}`);
      // 获取最新区块
      const block = await connection.getLatestBlockhash();
      // 等待交易确认
      await connection.confirmTransaction({
        signature,
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
      });

      toast.success("代币铸造成功");
      setAmount("");
    } catch (err) {
      console.error("铸造代币失败：", err);
      toast.error("铸造代币失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded my-4">
      <h2 className="font-semibold mb-2 md:text-xl text-base">铸造代币</h2>
      <div className="mb-2">
        <label className="block mb-1 text-gray-400">代币 Mint 地址：</label>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="代币 Mint 地址"
          className="w-full p-2 rounded bg-gray-700 text-white outline-none"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 text-gray-400">接收者地址：</label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="接收者地址"
          className="w-full p-2 rounded bg-gray-700 text-white outline-none"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 text-gray-400">铸造数量：</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="铸造数量（整数）"
          className="w-full p-2 rounded bg-gray-700 text-white outline-none"
        />
      </div>
      <button
        onClick={handleMint}
        className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "铸造中..." : "铸造代币"}
      </button>
      <Toaster />
    </div>
  );
}

export default MintTokenForm;
