/*
 * @description: 主入口文件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-22 23:10:05
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-22 23:26:54
 */
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultConfig, RainbowKitProvider, lightTheme,
  darkTheme, Chain } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  hardhat,
  localhost,
} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  metaMaskWallet,
  rainbowWallet, 
  walletConnectWallet,
  injectedWallet,
  coinbaseWallet,
  imTokenWallet,
  okxWallet,
  coreWallet,
  argentWallet,
  trustWallet, 
  uniswapWallet, 
  phantomWallet
} from '@rainbow-me/rainbowkit/wallets'

const config = getDefaultConfig({
  appName: 'my-app-wallet',
  projectId: '5e6260fddc2059c2b3d6e697283a05a0',
  chains: [localhost, hardhat, mainnet, polygon, optimism, arbitrum, base, sepolia],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, rainbowWallet, walletConnectWallet, coinbaseWallet]
    },
    {
    groupName: 'More',
    wallets: [okxWallet, trustWallet, argentWallet, uniswapWallet, coreWallet, imTokenWallet, phantomWallet, injectedWallet]
  }],
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider appInfo={{
          appName: 'my-app-wallet',
          learnMoreUrl: 'https://54web3.cc'
        }} coolMode showRecentTransactions={true} theme={{
          lightMode: lightTheme(),
          darkMode: darkTheme(),
        }}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  // </React.StrictMode>,
)
