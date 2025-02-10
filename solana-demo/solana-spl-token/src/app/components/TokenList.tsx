/*
 * @description: 代币列表组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 23:19:07
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-10 22:51:31
 */
"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import toast, { Toaster } from "react-hot-toast";

interface TokenAccountInfo {
  mint: string;
  amount: string;
  decimals: number;
  ataAddress: string;
}

function TokenList() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<TokenAccountInfo[]>([]);

  useEffect(() => {
    const updateBalance = async () => {
      if (!connection || !publicKey) return;

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

        // 获取SOL钱包余额
        const myBalance = await connection.getBalance(publicKey);
        // console.log("myBalance", myBalance);

        setBalance(myBalance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("获取SOL余额失败：", error);
        toast.error("获取SOL余额失败");
      }
    };

    updateBalance();

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
            ataAddress: item.pubkey.toBase58(),
          };
        });
        setTokens(tokenList);
        // console.log("tokenList", tokenList);
        tokenList.length && toast.success("代币列表已更新");
      } catch (err) {
        console.error("获取代币账户失败：", err);
        toast.error("获取代币列表失败");
      }
    };
    fetchTokenAccounts();
  }, [connection, publicKey]);

  return (
    <div>
      {/* <h2 className="font-semibold mb-2 md:text-xl text-base">SPL 代币列表</h2> */}
      {tokens.length === 0 ? (
        <>
          <div className="bg-gray-800 text-gray-400 p-3 my-2 mb-4 rounded md:text-base text-xs">
            <p>当前钱包余额: <span className="text-green-300">{balance} SOL</span></p>
          </div>
          <p className="md:text-base text-xs">暂无代币账户数据</p>
        </>
      ) : (
        <div>
          <div className="bg-gray-800 text-gray-400 p-3 my-2 mb-4 rounded md:text-base text-xs">
            <p>当前钱包余额: <span className="text-green-300">{balance} SOL</span></p>
          </div>
          <ul>
            {tokens.map((token, index) => (
              <li key={index} className="bg-gray-800 text-gray-400 p-3 my-1 rounded mb-4 md:text-base text-xs">
                <p>
                  铸币地址: <span className="text-green-300">{token.mint}</span>
                </p>
                <p>小数位数: <span className="text-white">{token.decimals}</span></p>
                <p>铸币数量: <span className="text-white">{token.amount}</span></p>
                <p>关联账户地址: <span className="text-white">{token.ataAddress}</span></p>
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
