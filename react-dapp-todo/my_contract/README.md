# 简单 Hardhat 项目

这个项目展示了一个基本的 Hardhat 用例。它附带了两份样本合约、包含合约的测试以及部署该合约的安全帽点火模块。

## 下载安装依赖

```shell
git clone https://github.com/jackchen0120/web3-dapp-all-example.git
cd react-dapp-todo/my_contact
npm install
```

## 编译合约

```shell
npx hardhat compile
```

## 本地部署合约

```shell
# 启动本地节点
npx hardhat node

# 本地网络部署
npx hardhat ignition deploy ./ignition/modules/TodoContract.ts --network localhost
```

## 测试网部署合约

```shell
# 测试网部署
npx hardhat ignition deploy ./ignition/modules/TodoContract.ts --network ganache
```

## 尝试运行以下任务

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```