<!--
 * @description: 用户交互组件（查询余额、提款、发布消息）
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-15 22:34:27
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-18 07:08:04
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ethers, BigNumberish } from "ethers"
import { ElMessage, ElNotification } from 'element-plus'
import { Todo, contractAddr } from '../types'
import contractABI from '../artifacts/contracts/TodoContract.sol/TodoContract.json'
import { timestampToDate } from '../utils'

const account = ref<string | undefined>(localStorage.getItem("account") || "")
const balance = ref<BigNumberish>()
const msg = ref<string>('')
const todoCount = ref<number>(0)
const todoList = ref<Todo[]>([])

// 获取合约账户余额
const getBalance = async () => {
  if (!window.ethereum) {
    ElNotification({
      title: "提示",
      message: "请先安装浏览器插件 Metamask",
      type: "warning",
    });
    return
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    account.value = await signer.getAddress()
    const todoContract = new ethers.Contract(contractAddr, contractABI.abi, provider)
    const count = await todoContract.getBalance()
    balance.value = ethers.formatEther(count)
    console.log('获取余额', balance.value)
  } catch (error: any) {
    console.error('获取余额失败：', error)
    ElMessage.error(error.reason || error.data?.message || error.message)
  }
}

// 获取提款
const getWithdraw = async () => {
  if (!window.ethereum) {
    ElNotification({
      title: "提示",
      message: "请先安装浏览器插件 Metamask",
      type: "warning",
    });
    return
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const todoContract = new ethers.Contract(contractAddr, contractABI.abi, signer)
    await todoContract.withdraw()
    ElMessage.success("提款成功")
  } catch (error: any) {
    console.error('获取提款失败：', error)
    ElMessage.error(error.reason || error.data?.message || error.message)
  }
}

// 发布消息
const publishMsg = async () => {
  if (!window.ethereum) {
    ElNotification({
      title: "提示",
      message: "请先安装浏览器插件 Metamask",
      type: "warning",
    });
    return
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const todoContract = new ethers.Contract(contractAddr, contractABI.abi, signer)
    todoContract.on("SendMoneyToContract", async (id, receiver, message, timestamp) => {
      localStorage.setItem("todoCount", id)
      console.log("%d %s", id, receiver)

      const todoList = localStorage.getItem("todoList")
      let list: Todo[] = []
      if (todoList) {
        list = JSON.parse(todoList)
      }
      const todo = new Todo(id, receiver, message, timestamp)
      list.push(todo)
      localStorage.setItem("todoList", JSON.stringify(list))
    })

    const params = { value: ethers.parseEther('0.1') }
    const tx = await todoContract.published(msg.value, params)
    await tx.wait()
    ElMessage.success("发布消息成功")
    setTimeout(() => {
      location.reload()
    }, 2000)
  } catch (error: any) {
    console.error('发布消息失败：', error)
    ElMessage.error(error.reason || error.data?.message || error.message)
  }
}

// 获取消息列表
const getTodoList = async () => {
  if (!window.ethereum) {
    ElNotification({
      title: "提示",
      message: "请先安装浏览器插件 Metamask",
      type: "warning",
    });
    return
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const todoContract = new ethers.Contract(contractAddr, contractABI.abi, signer)
    const list = await todoContract.getTodoList()
    if (list.length > 0) {
      list.map((item: Todo) => {
        const id = item.id
        const time = item.timestamp
        const todo = new Todo(id, item.author, item.message, time)
        todoList.value.push(todo)
      })
    }

    const count = list.length
    localStorage.setItem("todoCount", count)
    todoCount.value = list.length
  } catch (error) {
    console.error('获取消息列表失败：', error)
  }
}

const handleChange = (value: string) => {
  console.log('handleChange', value)
  msg.value = value.trim()
}

const getTodoCount = () => {
  const count = localStorage.getItem("todoCount")
  todoCount.value = count ? Number(count) : 0
}

onMounted(() => {
  if (!window.ethereum) {
    ElNotification({
      title: "提示",
      message: "请先安装浏览器插件 Metamask",
      type: "warning",
    });
    return
  }

  getBalance()
  getTodoCount()
  getTodoList()
})

</script>

<template>
  <div class="operation">
    <div class="item">
      <span>余额：<em>${{ balance || '0.0' }}</em></span>
      <el-button type="info" @click="getBalance">查询余额</el-button>
      <el-button type="primary" @click="getWithdraw">我要提款</el-button>
    </div>
    <div class="item">
      <el-input v-model="msg" placeholder="请输入消息" @input="handleChange"></el-input>
      <el-button type="success" @click="publishMsg" :disabled="!msg">发布消息</el-button>
    </div>
    <h3>统计：{{ todoCount }}</h3>
    <el-table :data="todoList" style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="author" label="接收者" minWidth="180" />
      <el-table-column prop="message" label="消息" minWidth="120" />
      <el-table-column prop="timestamp" label="时间戳">
        <template #default="scope">
          {{ timestampToDate(Number(scope.row.timestamp)) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.operation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
}

.item {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.item span em {
  color: red;
  font-size: 20px;
}
</style>