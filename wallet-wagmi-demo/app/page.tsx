/*
 * @description: 入口页面
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-09 00:09:35
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-09 01:05:29
 */
import Link from "next/link";

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
    <p>Hi guys, here are the demos:</p>
    <ol>
      <li>
        <Link href="/wallet-connect">连接钱包</Link>
      </li>
    </ol>
  </main>
  );
}
