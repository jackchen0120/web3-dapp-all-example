<!--
 * @description: 连接钱包组件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-11 21:24:03
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-16 02:12:55
-->
<script setup lang="ts">
import { ref } from 'vue'
import { ethers } from "ethers"
import { ElNotification } from 'element-plus'

const account = ref("")

const connectWallet = async () => {
  if (!window.ethereum) {
    // ElMessage.error("请先安装 Metamask")
    ElNotification({
      title: '提示',
      message: '请先安装浏览器插件 Metamask',
      type: 'warning',
    })
    return
  }

  window.ethereum.on("accountsChanged", function (accounts: string[]) {
    console.log("--------", accounts)
    account.value = accounts[0]
  })

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  account.value = await signer.getAddress()

  console.log("相关信息", provider, signer)
}
</script>

<template>
  <div class="wallet">
    <h3>连接你的钱包</h3>
    <el-button type="primary" @click="connectWallet">连接钱包</el-button>
    <p>钱包地址：{{ account }}</p>
  </div>
</template>

<style scoped></style>
