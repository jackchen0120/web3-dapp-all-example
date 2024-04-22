import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useEnsName } from 'wagmi'

function App() {
  const {address} = useAccount()
  const { data, error, status } = useEnsName({ address })
  console.log('address', address)
  console.log(data, error, status)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      padding: 12,
    }}>
      <ConnectButton />
      {address}
    </div>
  )
}

export default App
