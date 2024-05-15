/*
 * @description: 入口页面
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-09 00:09:35
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-15 10:54:15
 */
import Link from "next/link";

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="mt-5">大家好，下面是DEMO示例：</div>
      <ol>
        <li>
        <Link href="/wallet-connect">钱包连接</Link>
        </li>
        <li>
        <Link href="/read-chain-block">获取链和区块</Link>
        </li>
      </ol>
    </main>
  );
}
