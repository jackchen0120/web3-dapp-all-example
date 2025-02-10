/*
 * @description: 创建关联代币账户（ATA）表单组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 23:19:46
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-10 22:10:00
 */
"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  // getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import toast, { Toaster } from "react-hot-toast";

function CreateAtaForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [mintAddress, setMintAddress] = useState<string>(""); // 设置代币 Mint 地址
  const [ownerAddress, setOwnerAddress] = useState<string>(""); // 设置所有者地址
  const [ataAddress, setAtaAddress] = useState<string>(""); // 设置关联代币账户地址
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateAta = async () => {
    if (!connection || !publicKey || !mintAddress || !ownerAddress) {
      toast.error("请填写完整信息");
      return;
    }
    setLoading(true);
    try {
      const transaction = new Transaction();
      const mintPubkey = new PublicKey(mintAddress);
      const ownerPubkey = new PublicKey(ownerAddress);
      // 获取关联账户地址
      const ata = await getAssociatedTokenAddress(mintPubkey, ownerPubkey);
      // 创建关联账户指令
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey, // 支付手续费的账户
          ata, // 要创建的关联账户地址
          ownerPubkey, // 关联账户的所有者
          mintPubkey // 代币的mint地址
        )
      );

      const signature = await sendTransaction(transaction, connection);
      const block = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
      });

      toast.success("关联账户创建成功");
      setAtaAddress(ata.toBase58());
      setMintAddress("");
      setOwnerAddress("");
    } catch (err) {
      console.error("创建关联代币账户失败：", err);
      toast.error("创建关联账户失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded my-4">
      <h2 className="font-semibold mb-2 md:text-xl text-base">创建关联代币账户（ATA）</h2>
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
        <label className="block mb-1 text-gray-400">所有者地址：</label>
        <input
          type="text"
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
          placeholder="所有者地址"
          className="w-full p-2 rounded bg-gray-700 text-white outline-none"
        />
      </div>
      <button
        onClick={handleCreateAta}
        className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "处理中..." : "创建 ATA"}
      </button>
      {ataAddress && (
        <p className="mt-2">
          关联账户地址：<span className="text-green-300 md:text-base text-xs">{ataAddress}</span>
        </p>
      )}
      <Toaster />
    </div>
  );
}

export default CreateAtaForm;
