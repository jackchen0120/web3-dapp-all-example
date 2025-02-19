"use client";

import React, { useState } from "react";
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
  // createUnfreezeAccountInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const TokenManagement: React.FC = () => {
  const [connection] = useState(new Connection(clusterApiUrl("devnet"))); // 连接到 Solana 的 Devnet 网络
  const [payer] = useState(Keypair.generate()); // 生成付款人密钥对
  const [mint, setMint] = useState<PublicKey | null>(null); // 代币铸币地址
  const [sourceTokenAccount, setSourceTokenAccount] = useState<PublicKey | null>(null);
  const [destinationTokenAccount, setDestinationTokenAccount] = useState<PublicKey | null>(null);

  // 假设这些是代币的铸币地址、要解冻的代币账户地址和冻结权限所有者
  // const mint = new PublicKey('YOUR_MINT_PUBLIC_KEY');
  // const tokenAccountToThaw = await getAssociatedTokenAddress(mint, payer.publicKey);
  // const freezeAuthority = payer;

  // 创建代币
  const createToken = async () => {
    try {
      // 请求空投以获取 SOL
      const airdropSignature = await connection.requestAirdrop(
        payer.publicKey, // 接收空投的账户公钥
        LAMPORTS_PER_SOL // 空投的数量，单位为 Lamports
      );
      console.log("Airdrop signature:", airdropSignature);

      // 创建新的代币铸币账户
      const mintKeypair = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: mintKeypair.publicKey,
          lamports: LAMPORTS_PER_SOL / 2,
        })
      );

      const signature1 = await sendAndConfirmTransaction(connection, tx, [payer], {
        commitment: "confirmed", // 确认级别
        maxRetries: 3, // 最大重试次数
      });
      console.log("Airdrop transaction confirmed. Signature1:", signature1);

      // 获取账户的最新余额
      const balance = await connection.getBalance(payer.publicKey);
      console.log("Account balance after airdrop:", balance / LAMPORTS_PER_SOL, "SOL");

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: 82,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(mintKeypair.publicKey, 9, payer.publicKey, payer.publicKey, TOKEN_PROGRAM_ID)
      );

      // 发送并确认交易
      const signature = await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair]);
      console.log("Transaction confirmed. signature:", signature);
      setMint(mintKeypair.publicKey);

      // 创建源代币账户
      const sourceTokenAccount = await createAccount(connection, payer, mintKeypair.publicKey, payer.publicKey);
      setSourceTokenAccount(sourceTokenAccount);

      // 铸造代币到源账户
      const mintToTx = new Transaction().add(
        createMintToInstruction(mintKeypair.publicKey, sourceTokenAccount, payer.publicKey, 1000000000, [])
      );
      const mintToSignature = await sendAndConfirmTransaction(connection, mintToTx, [payer], {
        commitment: "confirmed", // 确认级别
        maxRetries: 3, // 最大重试次数
      });
      console.log("Transaction confirmed. mintToSignature:", mintToSignature);
      console.log("Token created and minted successfully!");
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  // 转移代币
  const transferToken = async () => {
    if (!mint || !sourceTokenAccount) return;

    try {
      // 创建目标关联代币账户
      const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
      setDestinationTokenAccount(destinationTokenAccount.address);
      console.log("destinationTokenAccount", destinationTokenAccount);

      // 创建转移指令
      const transferInstruction = createTransferInstruction(
        sourceTokenAccount,
        destinationTokenAccount.address,
        payer.publicKey,
        100000000
      );

      const transferTransaction = new Transaction().add(transferInstruction);
      const transferSignature = await sendAndConfirmTransaction(connection, transferTransaction, [payer]);

      console.log("Transaction confirmed. transferSignature:", transferSignature);
      console.log("Token transferred successfully!");
    } catch (error) {
      console.error("Error transferring token:", error);
    }
  };

  const burnToken = async () => {
    if (!mint || !sourceTokenAccount) return;

    try {
      // 创建销毁指令
      const burnInstruction = createBurnInstruction(sourceTokenAccount, mint, payer.publicKey, 100000000);

      const burnTransaction = new Transaction().add(burnInstruction);
      const burnSignature = await sendAndConfirmTransaction(connection, burnTransaction, [payer]);

      console.log("Transaction confirmed. burnSignature:", burnSignature);
      console.log("Token burned successfully!");
    } catch (error) {
      console.error("Error burning token:", error);
    }
  };

  // 冻结代币
  const freezeToken = async () => {
    if (!mint || !sourceTokenAccount) return;

    try {
      // 创建冻结指令
      const freezeInstruction = createFreezeAccountInstruction(sourceTokenAccount, mint, payer.publicKey);

      const freezeTransaction = new Transaction().add(freezeInstruction);
      const freezeSignature = await sendAndConfirmTransaction(connection, freezeTransaction, [payer]);

      console.log("Transaction confirmed. freezeSignature:", freezeSignature);
      console.log("Token account frozen successfully!");
    } catch (error) {
      console.error("Error freezing token account:", error);
    }
  };

  // 解冻代币
  const unfreezeToken = async () => {
    if (!mint || !sourceTokenAccount) return;

    try {
      // 创建解冻指令
      const unfreezeInstruction = createThawAccountInstruction(
        sourceTokenAccount, // 要解冻的代币账户地址
        mint, // 代币铸币地址
        payer.publicKey, // 冻结权限所有者的公钥
        [], // 多签账户的签名者列表（如果有）
        TOKEN_PROGRAM_ID // 代币程序 ID
      );

      const unfreezeTransaction = new Transaction().add(unfreezeInstruction);
      const unfreezeSignature = await sendAndConfirmTransaction(connection, unfreezeTransaction, [payer]);

      console.log("Transaction confirmed. unfreezeSignature:", unfreezeSignature);
      console.log("Token account unfrozen successfully!");
    } catch (error) {
      console.error("Error unfreezing token account:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Solana Token Management</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2" onClick={createToken}>
        Create Token
      </button>
      <button className="bg-green-500 text-white px-4 py-2 rounded-md mb-2 ml-2" onClick={transferToken}>
        Transfer Token
      </button>
      <button className="bg-red-500 text-white px-4 py-2 rounded-md mb-2 ml-2" onClick={burnToken}>
        Burn Token
      </button>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded-md mb-2 ml-2" onClick={freezeToken}>
        Freeze Token Account
      </button>
      <button className="bg-purple-500 text-white px-4 py-2 rounded-md mb-2 ml-2" onClick={unfreezeToken}>
        Unfreeze Token Account
      </button>
    </div>
  );
};

export default TokenManagement;
