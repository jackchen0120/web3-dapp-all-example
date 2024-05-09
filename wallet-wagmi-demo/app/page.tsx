/*
 * @description: 入口页面
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-09 00:09:35
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-09 21:34:09
 */
import WalletConnect from "./wallet-connect/page";

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <WalletConnect />
    </main>
  );
}
