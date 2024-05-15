import React from 'react'
import dynamic from "next/dynamic";

const WalletConnect = dynamic(() => import('../components/WalletConnect'), { ssr: false });

export default function Page() {
  return (
    <WalletConnect />
  )
}
