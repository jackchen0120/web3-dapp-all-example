import Wallets from "./components/Wallets";
import SecretKey from "./components/SecretKey";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold p-10">Solana Wallet Connect Demo</div>
      <Wallets />
      <br />
      <SecretKey />
    </div>
  );
}
