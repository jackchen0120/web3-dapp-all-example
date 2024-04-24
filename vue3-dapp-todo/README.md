# Vue 3 + TypeScript + Web3 + dApp

## 前言

去中心化应用（dApp）是构建在区块链技术上的应用程序，具有去中心化、透明、安全的特性。dApp 开发需要掌握区块链技术、智能合约编写、前端和后端开发等多个领域。

## 在线教程

[手把手教你从零搭建一款属于自己的 dApp 全栈项目（Vue3+TS）](https://54web3.cc/blog/dapp/dapp-vue3-ethers)

## 技术栈

- vue3
- typescript
- ethers.js
- hardhat
- ganache
- solidity
- metamask
- element-plus
- remix ide

## 功能模块

- 钱包登录
- 查询余额
- 我要提款
- 发布消息
- 消息列表

## 下载安装依赖

```shell
git clone https://github.com/jackchen0120/web3-dapp-all-example.git
cd vue3-dapp-todo
yarn or npm install
```

## 启动 Hardhat 项目

```shell
cd my_contact
npm install
npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/TodoContract.ts --network ganache
```

## 开发模式

```shell
cd vue3-dapp-todo
yarn dev
```

运行之后，访问地址：http://localhost:5173/

## 生产模式

```shell
cd vue3-dapp-todo
yarn build
```

#### 获取更多项目实战经验及各种源码资源，请关注作者公众号：懒人码农

<img src="https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAyMC81LzEzLzE3MjBlM2U0ZmQ5NDZiZDQ?x-oss-process=image/format,png" width="430" alt="公众号二维码" />
