<!--
 * @description: 连接钱包组件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-11 21:24:03
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-18 06:16:11
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ethers } from "ethers"
import { ElMessage, ElNotification } from 'element-plus'
import Operation from './Operation.vue'

const account = ref<string | undefined>(localStorage.getItem("account") || "")
const chainId = ref<string | undefined>(localStorage.getItem("chainId") || "")

const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      console.log("-------------", ethers.getDefaultProvider())
      ElNotification({
        title: "提示",
        message: "请先安装浏览器插件 Metamask",
        type: "warning",
      });
      return
    }

    const provider = new ethers.BrowserProvider(window.ethereum) // 获取提供者
    const signer = await provider.getSigner() // 获取钱包签名
    account.value = await signer.getAddress() // 获取钱包地址
    // const myAccounts = await provider.send("eth_requestAccounts", [])
    // console.log("相关信息", provider, signer, myAccounts)
    const network = await provider.getNetwork()
    chainId.value = network.chainId.toString()
    // 保存相关信息到本地
    localStorage.setItem("chainId", chainId.value)
    localStorage.setItem("account", account.value)
    ElMessage.success("连接钱包成功")
  } catch (error) {
    console.log('连接钱包失败：', error)
  }
}

const disconnectWallet = async () => {
  if (localStorage.getItem("account")) {
    account.value = ""
    localStorage.removeItem("account")
    ElMessage.warning("断开钱包成功")
  }
}

onMounted(() => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", function (accounts: string[]) {
      // 钱包账户变化
      console.log("钱包账户变化", accounts[0])
      account.value = accounts[0]
      localStorage.setItem("account", account.value)
    })
    window.ethereum.on("chainChanged", function (chainId: number) {
      // 切换网络
      console.log("切换网络", chainId)
      localStorage.setItem("chainId", chainId.toString())
    })
  }
})
</script>

<template>
  <div class="wallet">
    <div v-if="!account" class="wallet-login">
      <h3>连接 Metamask 钱包</h3>
      <el-button type="primary" @click="connectWallet" size="large">连接钱包</el-button>
    </div>
    <div v-else>
      <el-button type="danger" @click="disconnectWallet">断开钱包</el-button>
      <p>钱包地址：{{ account }}</p>
      <p>链ID：{{ chainId }}</p>
      <Operation />
    </div>
  </div>
</template>

<style scoped>
.wallet {
  width: 1000px;
}

.wallet-login {
  margin: 0 auto;
  text-align: center;
}
</style>
