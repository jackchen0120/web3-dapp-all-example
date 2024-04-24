/*
 * @description: 用户交互组件（查询余额、提款、发布消息）
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-22 23:10:05
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-24 04:43:58
 */
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { type BaseError, useBalance, useWaitForTransactionReceipt, useWriteContract, useBlockNumber, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import contractABI from '../artifacts/contracts/TodoContract.sol/TodoContract.json'
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Input, Table, message, Tag, Tooltip } from 'antd'
import type { TableProps } from 'antd'
import { formatTxHash, timestampToDate } from '../utils'
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '../config'

interface DataType {
  id: string;
  key: string;
  author: string;
  message: number;
  timestamp: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <span>{text.toString()}</span>,
  },
  {
    title: '接收者',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: '消息',
    dataIndex: 'message',
    key: 'message',
  },
  {
    title: '时间戳',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (text) => (<span>{timestampToDate(Number(text))}</span>),
  },
];

function Todo() {
  const [msg, setMsg] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isWithdraw, setWithdraw] = useState<boolean>(false)
  const [todoList, setTodoList] = useState<DataType[]>([])
  const [balance, setBalance] = useState<string>('')
  const { address, isConnected, chainId } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const [messageApi, contextHolder] = message.useMessage()

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS // 合约地址

  const { data: hash, error, isPending, writeContractAsync } = useWriteContract() 
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

  // 读取合约账户余额  
  const getBalance = useCallback(async () => {
    try {
      const result = await readContract(config, {
        address: contractAddress,
        abi: contractABI.abi,
        functionName: 'getBalance',
      })
      console.log('读取合约账户余额', result)
      const amount = result?.toString() ? formatEther(result as bigint) || '0.0' : '0.0'
      setBalance(amount)
    } catch (error) {
      console.error('error', error)
      // messageApi.open({
      //   type: 'error',
      //   duration: 4,
      //   content: `读取合约账户余额失败：${(error as BaseError)?.details}`,
      // })
    }
  }, [contractAddress])

  // 读取消息列表
  const getTodoList = useCallback(async () => {
    setLoading(true)
    setTodoList([])
    try {
      const result = await readContract(config, {
        address: contractAddress,
        abi: contractABI.abi,
        functionName: 'getTodoList',
      })
      console.log('读取消息列表', result)
      const arr = (result as DataType[])
      if (arr && arr.length) {
        const dataSource = arr.map((item: DataType) => {
          return {
            key: item.id.toString(),
            id: item.id.toString(),
            author: item.author,
            message: item.message,
            timestamp: item.timestamp.toString(),
          }
        }).sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
        
        setTodoList(dataSource)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('error', error)
      messageApi.open({
        type: 'error',
        duration: 4,
        content: `读取消息列表失败：${(error as BaseError)?.details || (error as BaseError)?.shortMessage}`,
      })
    }
  }, [contractAddress, messageApi])

  // 我要提款
  const getWithdraw = async () => {
    setWithdraw(true)
    try {
      const result = await writeContract(config, {
        abi: contractABI.abi,
        address: contractAddress,
        functionName: 'withdraw',
      })
      console.log("发起提款", result)
      const txReceipt = await waitForTransactionReceipt(config, { hash: result })
      console.log("等待提款", txReceipt)
      if (txReceipt.status === 'success') {
        messageApi.open({
          type: 'success',
          duration: 4,
          content: '提款成功',
        })
      }
      setWithdraw(false)
    } catch (error) {
      setWithdraw(false)
      console.error('error', error)
      messageApi.open({
        type: 'error',
        duration: 4,
        content: `提款失败：${(error as BaseError)?.details}`,
      })
    }
  }

  // 发布消息
  const publishMsg = async () => {
    setIsLoading(true)
    try {
      const result = await writeContractAsync({
        abi: contractABI.abi,
        address: contractAddress,
        functionName: 'published',
        args: [msg.trim()],
        value: parseEther('0.1'),
      })
      setMsg('')
      console.log("发布消息", result)
      messageApi.open({
        type: 'success',
        content: '发布消息成功',
      })
    } catch (error) {
      console.error('error', error)
      messageApi.open({
        type: 'error',
        duration: 4,
        content: `发布消息失败：${(error as BaseError)?.details}`,
      })
    }
  }

  // 监听消息发布
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value)
  }

  console.log("address", address, chainId)

  useEffect(() => {
    let timer = undefined
    if (isConnected && chainId === 1337) {
      timer = setInterval(() => {
        getBalance()
        getTodoList()
      }, 6000)
      getBalance()
      getTodoList()
    } else {
      clearInterval(timer)
    }
    return () => {
      clearInterval(timer)
    }
  }, [getBalance, getTodoList, isConnected, chainId])

  const showTotal: (total: number, range: [number, number]) => ReactNode = (total) => {
    return (
      <div>
        共 { total } 条数据
      </div>
    );
  }

  return (
    <div className='main'>
      {contextHolder}
      <div className="item">
        <span>合约账户余额：<em>{ isConnected ? Number(balance) || '0.0' : '0.0' }</em> { balanceData?.symbol }</span>
        {/* <Button type="primary" ghost onClick={getBalance}>查询余额</Button> */}
        <Button type="primary" onClick={getWithdraw} loading={isWithdraw} disabled={!isConnected}>我要提款</Button>
      </div>
      <div className='item'><span>当前区块高度：{ isConnected ? blockNumber?.toString() || '-' : '-'}</span></div>
      <div className="item">
        <Input value={msg} count={{
          show: true,
          max: 50,
        }} maxLength={50} placeholder="请输入消息内容" onInput={handleChange}></Input>
        <Button type='primary' loading={isLoading && isPending} onClick={publishMsg} disabled={!isConnected || !msg}>{isPending ? '确认中...' : '发布消息'}</Button>
      </div>
      {isConnected && chainId === 1337 && hash && (
        <div className='item'>
          <Tooltip title={hash}>
            <span>交易哈希: {formatTxHash(hash)}</span>
          </Tooltip>
        </div>
      )}
      {isConnected && chainId === 1337 && isConfirming && (
        <div className='item'>
          <Tag icon={<SyncOutlined spin />} color="processing">
            交易确认中...
          </Tag>
        </div>
      )} 
      {isConnected && chainId === 1337 && isConfirmed && (
        <div className='item'>
          <Tag icon={<CheckCircleOutlined />} color="success">
            交易已确认
          </Tag>
        </div>
      )} 
      {/* {error && ( 
        <div className='item'>
          <span className='error'>错误回调: {(error as BaseError).shortMessage || error.message}</span>
        </div> 
      )}  */}
      <div className="total">
        <Table loading={loading} columns={columns} dataSource={isConnected && chainId === 1337 ? todoList : []} pagination={{ pageSize: 6, showTotal }} />
      </div>
    </div>
  )
}

export default Todo
