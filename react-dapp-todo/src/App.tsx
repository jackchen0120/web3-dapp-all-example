/*
 * @description: 主组件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-22 23:10:05
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-22 23:26:54
 */
import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

function App() {
  const {address} = useAccount()
  console.log('address', address)

  return (
    <div className="App">
      <header className="header">
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 50 50"><path fill="#165BA6FF" stroke="#165BA6FF" d="M2.167 7.849c.183.467 4.804 8.567 10.27 18C21.229 41.026 22.669 43 24.944 43c1.981 0 3.2-1.042 5.313-4.541C31.766 35.962 33 33.428 33 32.828c0-.599-3.198-6.681-7.107-13.515-6.266-10.955-7.39-12.389-9.5-12.119-2.32.297-2.175.688 4.681 12.67 6.602 11.537 6.995 12.556 5.879 15.25-.658 1.587-1.48 2.886-1.827 2.886-.348 0-4.629-6.975-9.514-15.5C7.956 9.138 6.393 7 4.282 7c-1.347 0-2.299.382-2.115.849M29.495 13.25c1.986 3.438 4.345 7.713 5.243 9.5 1.946 3.874 3.01 4.104 3.831.829.411-1.637-.229-3.85-1.98-6.838C35.165 14.312 34 12.026 34 11.662S35.34 11 36.977 11c2.086 0 3.476.762 4.644 2.545l1.668 2.545 2.355-4.147C46.94 9.662 48 7.617 48 7.398S43.024 7 36.942 7H25.884l3.611 6.25"></path></svg>
          <h2>Web3研习社</h2>
        </div>
        <div className="wallet">
          <ConnectButton />
        </div>
      </header>
      <main></main>
    </div>
  )
}

export default App
