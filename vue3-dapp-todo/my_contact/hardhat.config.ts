/*
 * @description: hardhat 配置文件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-11 21:37:22
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-17 03:06:23
 */
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    artifacts: "../src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x2c323af53bd725630ef16cb135fb81703da72ec8168db17a7d5e56f572696852",
      ],
    },
  },
};

export default config;
