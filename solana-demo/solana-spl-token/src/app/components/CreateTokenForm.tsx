/*
 * @description: 创建代币（Token Mint）组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 23:19:29
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-09 23:50:42
 */
"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import toast, { Toaster } from "react-hot-toast";

function CreateTokenForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [mintAddress, setMintAddress] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(9);
  const [loading, setLoading] = useState(false);

  const handleCreateToken = async () => {
    if (!connection || !publicKey) return;
    toast.error("请先连接钱包");
    setLoading(true);
    try {
      // 创建临时密钥对，用于支付创建代币的费用
      const mintKeypair = Keypair.generate();
      // 获取创建代币所需的最小租金
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      // 向临时密钥对转移租金
      const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(mintKeypair.publicKey, decimals, publicKey, publicKey, TOKEN_PROGRAM_ID)
      );
      const signature = await sendTransaction(tx, connection, { signers: [mintKeypair] });
      console.log("signature", signature);
      toast.success(`代币创建成功，Mint地址：${mintKeypair.publicKey.toBase58()}`);
      setMintAddress(mintKeypair.publicKey.toBase58());
    } catch (err) {
      console.error("创建代币失败：", err);
      toast.error("创建代币失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="font-semibold mb-2 md:text-xl text-base">创建新代币（Mint）</h2>
      <div className="mb-2">
        <label className="block mb-1 text-gray-400">小数位数：</label>
        <input
          type="number"
          value={decimals}
          onChange={(e) => setDecimals(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-700 text-white outline-none"
        />
      </div>
      <button
        onClick={handleCreateToken}
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "创建中..." : "创建代币"}
      </button>
      {mintAddress && (
        <p className="mt-2">
          新代币地址：<span className="text-green-300 md:text-base text-xs">{mintAddress}</span>
        </p>
      )}
      <Toaster />
    </div>
  );
}

export default CreateTokenForm;
