/*
 * @description: hardhat配置文件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-11 21:37:22
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-15 22:16:50
 */
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    artifacts: "../src/artifacts",
  },
};

export default config;
