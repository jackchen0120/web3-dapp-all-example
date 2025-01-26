import React from "react";
import { Keypair } from "@solana/web3.js";

export default function SecretKey() {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = keypair.secretKey;
  // console.log(`公钥：${publicKey}`);
  // console.log(`私钥：${secretKey}`);

  // 导入私钥
  // const keypairTwo = Keypair.fromSecretKey(Uint8Array.from(secretKey));
  // console.log(`公钥2：${keypairTwo.publicKey.toBase58()}`);
  // console.log(`私钥2：${keypairTwo.secretKey}`);

  return (
    <div className="flex flex-col mx-auto gap-2">
      <div>公钥：{publicKey}</div>
      <div className="flex justify-center text-left">
        私钥：
        <div className="text-wrap break-all w-1/2">{secretKey}</div>
      </div>
    </div>
  );
}
