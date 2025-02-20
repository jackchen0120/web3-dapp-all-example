"use client";

import React, { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAccount,
  createAssociatedTokenAccountInstruction,
  createBurnInstruction,
  createFreezeAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  createTransferInstruction,
  createThawAccountInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from "@solana/spl-token";
import toast, { Toaster } from "react-hot-toast";
import ConnectWalletButton from "./ConnectWalletButton";
import TokenList from "./TokenList";

const TokenManagement: React.FC = () => {
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const [payer] = useState(Keypair.generate()); // 生成付款人密钥对
  const [mint, setMint] = useState<PublicKey | null>(null); // 代币铸币地址
  const [balance, setBalance] = useState<number>(0);
  const [sourceTokenAccount, setSourceTokenAccount] = useState<PublicKey | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<PublicKey | null>(null);
  const [decimals, setDecimals] = useState<number>(9);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [loading3, setLoading3] = useState<boolean>(false);
  const [loading4, setLoading4] = useState<boolean>(false);
  const [loading5, setLoading5] = useState<boolean>(false);

  // 创建代币
  const createToken = async () => {
    if (!connection || !publicKey) return;

    setLoading(true);

    try {
      // 创建新的代币铸币账户
      const mintKeypair = Keypair.generate();
      // 获取铸造代币所需的最低租金豁免余额
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

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

      // 发送并确认交易签名
      const signature = await sendTransaction(tx, connection, { signers: [mintKeypair] });
      // console.log("Transaction confirmed. signature:", signature);
      setMint(mintKeypair.publicKey);

      // 获取关联账户地址
      const sourceATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);
      // 创建关联账户指令
      const txAta = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey, // 支付手续费的账户
          sourceATA, // 要创建的关联账户地址
          publicKey, // 关联账户的所有者
          mintKeypair.publicKey // 代币的mint地址
        )
      );

      const ataSignature = await sendTransaction(txAta, connection);
      const ataBlock = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: ataSignature,
        blockhash: ataBlock.blockhash,
        lastValidBlockHeight: ataBlock.lastValidBlockHeight,
      });

      setSourceTokenAccount(sourceATA);
      console.log("关联账户成功", sourceATA);

      // 铸造代币到源账户
      const mintToTx = new Transaction().add(
        // 创建铸币指令
        createMintToInstruction(mintKeypair.publicKey, sourceATA, publicKey, 10 * 10 ** decimals, [])
      );
      const mintToSignature = await sendTransaction(mintToTx, connection);
      // console.log("Transaction confirmed. mintToSignature:", mintToSignature);
      // 获取最新区块
      const block = await connection.getLatestBlockhash();
      // 等待交易确认
      await connection.confirmTransaction({
        signature: mintToSignature,
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
      });
      console.log("创建代币及铸币成功！", mint?.toBase58());
    } catch (error) {
      console.error("创建代币失败：", error);
    } finally {
      setLoading(false);
    }
  };

  // 转移代币
  const transferToken = async () => {
    if (!mint || !publicKey || !recipientAddress || !sourceTokenAccount) return;

    setLoading2(true);

    try {
      // 获取关联代币账户
      const recipientATA = await getAssociatedTokenAddress(mint, recipientAddress);
      // const sourceATA = await getAssociatedTokenAddress(mint, publicKey);
      const tx = new Transaction();
      console.log("recipientATA-sourceATA", recipientATA, sourceTokenAccount);

      const ataInfo = await connection.getAccountInfo(recipientATA);

      if (!ataInfo) {
        tx.add(createAssociatedTokenAccountInstruction(publicKey, recipientATA, recipientAddress, mint));
      }

      tx.add(
        // 创建转移指令
        createTransferInstruction(sourceTokenAccount, recipientATA, publicKey, 10 ** (decimals - 1))
      );

      const transferSignature = await sendTransaction(tx, connection);

      console.log("Transaction confirmed. transferSignature:", transferSignature);
      console.log("代币转移成功！");
    } catch (error) {
      console.error("代币转移失败：", error);
    } finally {
      setLoading2(false);
    }
  };

  // 销毁代币
  const burnToken = async () => {
    if (!mint || !publicKey || !sourceTokenAccount) return;

    setLoading3(true);

    try {
      const burnTx = new Transaction().add(
        // 创建销毁指令
        createBurnInstruction(sourceTokenAccount, mint, publicKey, 10 ** (decimals - 1))
      );
      const burnSignature = await sendTransaction(burnTx, connection);

      console.log("Transaction confirmed. burnSignature:", burnSignature);
      console.log("代币销毁成功！");
    } catch (error) {
      console.error("代币销毁失败：", error);
    } finally {
      setLoading3(false);
    }
  };

  // 冻结代币
  const freezeToken = async () => {
    if (!mint || !publicKey || !sourceTokenAccount) return;

    setLoading4(true);

    try {
      const freezeTx = new Transaction().add(
        // 创建冻结指令
        createFreezeAccountInstruction(sourceTokenAccount, mint, publicKey)
      );
      const freezeSignature = await sendTransaction(freezeTx, connection);

      console.log("Transaction confirmed. freezeSignature:", freezeSignature);
      console.log("冻结代币成功！");
    } catch (error) {
      console.error("冻结代币失败：", error);
    } finally {
      setLoading4(false);
    }
  };

  // 解冻代币
  const unfreezeToken = async () => {
    if (!mint || !publicKey || !sourceTokenAccount) return;

    setLoading5(true);

    try {
      const unfreezeTx = new Transaction().add(
        // 创建解冻指令
        createThawAccountInstruction(
          sourceTokenAccount, // 要解冻的代币账户地址
          mint, // 代币铸币地址
          publicKey, // 冻结权限所有者的公钥
          [], // 多签账户的签名者列表（如果有）
          TOKEN_PROGRAM_ID // 代币程序 ID
        )
      );
      const unfreezeSignature = await sendTransaction(unfreezeTx, connection);

      console.log("Transaction confirmed. unfreezeSignature:", unfreezeSignature);
      console.log("解冻代币成功！");
    } catch (error) {
      console.error("解冻代币失败：", error);
    } finally {
      setLoading5(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Solana Token Management</h1>
      <ConnectWalletButton />
      {/* <div className="pb-4">我的余额：{balance / LAMPORTS_PER_SOL} SOL</div> */}
      <div className="pb-4">代币关联账户：{sourceTokenAccount?.toBase58()}</div>
      <div className="pb-4">铸币地址：{mint?.toBase58()}</div>
      {connected && publicKey && (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md mb-2"
            onClick={createToken}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Token"}
          </button>
          <button
            className="bg-green-500 hover:bg-green-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md mb-2 ml-2"
            onClick={transferToken}
            disabled={loading2}
          >
            {loading2 ? "Transfering..." : "Transfer Token"}
          </button>
          <button
            className="bg-red-500 hover:bg-red-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md mb-2 ml-2"
            onClick={burnToken}
            disabled={loading3}
          >
            {loading3 ? "Burning..." : "Burn Token"}
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md mb-2 ml-2"
            onClick={freezeToken}
            disabled={loading4}
          >
            {loading4 ? "Freezing..." : "Freeze Token Account"}
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md mb-2 ml-2"
            onClick={unfreezeToken}
            disabled={loading5}
          >
            {loading5 ? "Unfreezing..." : "Unfreeze Token Account"}
          </button>
        </>
      )}
      <div className="pt-4">
        <TokenList />
      </div>
      <Toaster />
    </div>
  );
};

export default TokenManagement;
