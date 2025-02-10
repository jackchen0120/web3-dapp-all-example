/*
 * @description: 代币列表组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 23:19:07
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-09 23:48:50
 */
"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import toast, { Toaster } from "react-hot-toast";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface TokenAccountInfo {
  mint: string;
  amount: string;
  decimals: number;
}

function TokenList() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<TokenAccountInfo[]>([]);

  useEffect(() => {
    const fetchTokenAccounts = async () => {
      if (!connection || !publicKey) return;
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });
        const tokenList = tokenAccounts.value.map((item) => {
          const info: any = item.account.data.parsed.info;
          // console.log("info", info);
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmountString,
            decimals: info.tokenAmount.decimals,
          };
        });
        setTokens(tokenList);
        toast.success("代币列表已更新");
      } catch (err) {
        console.error("获取代币账户失败：", err);
        toast.error("获取代币列表失败");
      }
    };
    fetchTokenAccounts();
  }, [publicKey, connection]);

  useEffect(() => {
    const updateBalance = async () => {
      if (!connection || !publicKey) {
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
        toast.error("获取SOL余额失败");
      }
    };

    updateBalance();
  }, [connection, publicKey]);

  return (
    <div>
      <h2 className="font-semibold mb-2 md:text-xl text-base">SPL 代币列表</h2>
      {tokens.length === 0 ? (
        <p className="md:text-base text-xs">暂无代币账户数据</p>
      ) : (
        <div>
          <div className="bg-gray-800 p-3 my-2 mb-4 rounded md:text-base text-xs">
            <p>SOL 余额: {balance}</p>
          </div>
          <ul>
            {tokens.map((token, index) => (
              <li key={index} className="bg-gray-800 p-3 my-1 rounded mb-4 md:text-base text-xs">
                <p>
                  Mint: <span className="text-green-300">{token.mint}</span>
                </p>
                <p>Decimals: {token.decimals}</p>
                <p>余额: {token.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default TokenList;
