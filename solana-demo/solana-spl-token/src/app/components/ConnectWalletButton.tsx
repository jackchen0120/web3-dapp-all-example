/*
 * @description: 连接钱包按钮组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 23:19:07
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-09 23:49:06
 */
'use client';

import dynamic from "next/dynamic";
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// 动态导入钱包组件
const WalletMultiButton = dynamic(async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton, {
  ssr: false,
});

function ConnectWalletButton() {
  return (
    <div className="mb-4">
      <WalletMultiButton className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" />
    </div>
  )
}

export default ConnectWalletButton