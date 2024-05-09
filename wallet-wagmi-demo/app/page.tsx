/*
 * @description: 入口页面
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-09 00:09:35
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-09 22:43:30
 */
import dynamic from "next/dynamic";

const WalletConnect = dynamic(() => import('./components/WalletConnect'), { ssr: false });

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <WalletConnect />
    </main>
  );
}
