/*
 * @description: 主入口文件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-22 23:10:05
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-24 03:22:38
 */
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css'

import { RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config'




const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider appInfo={{
          appName: '@懒人码农',
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
