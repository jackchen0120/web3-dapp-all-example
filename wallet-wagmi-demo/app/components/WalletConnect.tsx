/*
 * @description: WalletConnect组件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-09 00:09:35
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-09 22:46:54
 */
"use client";

import { useEffect, useState } from "react";
import { Button } from "antd";
import Image from "next/image";
import {
  useConnect,
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

const Account = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <>
      {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar} />}
      {address && <div className="my-5">{ensName ? `${ensName} (${address})` : address}</div>}
      <Button type="primary" onClick={() => disconnect()}> 断开连接</Button>
    </>
  );
};

const ConnectorButton = ({ connector }: { connector: any }) => {
  const [providerReady, setProviderReady] = useState(false);
  const { connect } = useConnect();

  useEffect(() => {
    if (!connector) return;
    (async () => {
      try {
        const provider = await connector.getProvider();
        setProviderReady(!!provider);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [connector]);

  const onClick = () => {
    connect({ connector: connector });
  };

  return (
    <Button
      block
      icon={
        connector.icon && <Image
          src={connector.icon}
          width={14}
          height={14}
          alt={connector.name}
        />
      }
      type="primary"
      loading={!providerReady}
      onClick={onClick}
    >
      {connector.name}
    </Button>
  );
};

export default function WalletCon() {
  const { connectors } = useConnect();
  const { isConnected } = useAccount();

  if (isConnected) return <Account />;

  const walletConnectConnector = connectors.find(
    (connector) => connector.id === "walletConnect"
  );

  const injectedConnector = connectors.find(
    (connector) => connector.id === "injected"
  );

  const eip6963Connectors = connectors.filter(
    (connector) =>
      connector !== walletConnectConnector && connector !== injectedConnector
  );

  const eip6963Buttons = eip6963Connectors.map((connector) => (
    <ConnectorButton key={connector.id} connector={connector} />
  ));

  return (
    <div className="flex flex-col mt-10 items-center">
      <div className="inline-flex w-80 p-5 my-2 border-2 border-black border-dashed flex-col items-center gap-y-1">
        <div className="my-2">以下是手机钱包扫码访问钱包功能 <strong>WalletConnect</strong></div>
        <ConnectorButton connector={walletConnectConnector} />
      </div>
      <div className="inline-flex w-80 p-5 my-2 border-2 border-black border-dotted flex-col items-center gap-y-1">
        <div className="my-2">以下是 EIP-1193 提供的注入链路功能</div>
        <ConnectorButton connector={injectedConnector} />
      </div>
      <div className="inline-flex w-80 p-5 my-2 border-2 border-black border-double flex-col items-center gap-y-1">
        <div className="my-2">以下是您的浏览器支持的 Chrome 扩展，可从 EIP-6963 中找到</div>
        {eip6963Buttons}
      </div>
    </div>
  );
}
