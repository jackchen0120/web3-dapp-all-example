# React + TypeScript + Web3 + DApp

## 前言

在讲解 React 全栈项目之前，想让大家对 DApp 技术栈有个快速的认知，可以先去我的博客看看这篇[《DApp 开发快速入门教程》](https://54web3.cc/blog/induction-tutorial/dapp-dev-learn-course)，最近还写了一篇 Vue3 版的 DApp 项目也可以看下[《手把手教你从零搭建一款 dApp 全栈项目（Vue3+TS）》](https://mp.weixin.qq.com/s/FLzyTz0juvMjHj1kjEH29Q)，跟着我的教程一步一步操作，轻松上手那都不是事，学完后可以掌握 DApp 研发的基础知识。

> 此教程主要面向有一定前端开发基础的同学，帮助你从 Web2 迈向 Web3，获得 DApp（去中心化应用）的研发能力。

## 在线教程

[前端程序员如何玩转 Web3 轻松开发 DApp 全栈项目（React+TS）](https://54web3.cc)

## 技术栈

- react v18
- typescript
- rainbowkit
- wagmi
- viem
- Antd
- hardhat
- ganache
- solidity
- metamask
- remix ide

## 功能模块

- 多钱包登录
- 查询余额
- 我要提款
- 发布消息
- 消息列表

## 下载安装依赖

```shell
git clone https://github.com/jackchen0120/web3-dapp-all-example.git
cd react-dapp-todo
yarn or npm install
```

## 启动 Hardhat 项目

```shell
cd contacts
npm install
npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/TodoContract.ts --network ganache
```

## 开发模式

```shell
cd react-dapp-todo
yarn dev
```

运行之后，访问地址：http://localhost:5173/

## 生产模式

```shell
cd react-dapp-todo
yarn build
```

#### 获取更多项目实战经验及各种源码资源，请关注作者公众号：懒人码农

<img src="https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAyMC81LzEzLzE3MjBlM2U0ZmQ5NDZiZDQ?x-oss-process=image/format,png" width="430" alt="公众号二维码" />
