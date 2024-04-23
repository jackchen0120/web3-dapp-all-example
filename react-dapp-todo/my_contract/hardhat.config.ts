/*
 * @description: hardhat 配置文件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-23 22:15:23
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-24 00:25:13
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
      url: "http://127.0.0.1:8545",
      accounts: [
        "0xb33048cdde31d7ecc86c22a62cccf2d9348fc48209d5340c5a79c5995b226a60",
        "0x8b2bb2e302a24d1bf4c926045ec6fb4d7a9b9fa3469bd437da4bf027dc420645",
      ],
    },
  },
};

export default config;
