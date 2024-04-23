import { ConnectButton } from '@rainbow-me/rainbowkit'
import Logo from '../assets/web3.svg'

function Header() {
  return (
    <div className="header">
      <div className="logo">
        <a href='/'>
          <img src={Logo} alt="web3研习社" />
          <h2>Web3研习社</h2>
        </a>
      </div>
      <div className="wallet">
        <ConnectButton accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }} />
      </div>
    </div>
  )
}

export default Header
