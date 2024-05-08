/*
 * @description: 钱包配置
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-09 00:22:43
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-09 00:29:36
 */
import { http, createConfig } from "wagmi";
import { mainnet, arbitrum, optimism, immutableZkEvm } from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";

// 用于测试的一个临时项目ID
const projectId = "5e6260fddc2059c2b3d6e697283a05a0";

export const wConnector = walletConnect({
  projectId,
  metadata: {
    name: "Wagmi",
    description: "Wagmi wallet connect",
    url: "https://wagmi.xyz",
    icons: ["https://wagmi.xyz/logo.png"],
  },
});

export const config = createConfig({
  chains: [mainnet, arbitrum, optimism, immutableZkEvm],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [immutableZkEvm.id]: http(),
  },
  connectors: [wConnector, injected()],
});
