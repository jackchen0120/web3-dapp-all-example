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
import { readContract } from '@wagmi/core'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [todoList, setTodoList] = useState<DataType[]>([])
  const [balance, setBalance] = useState<string>('')
  const { address } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const [messageApi, contextHolder] = message.useMessage()

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS // 合约地址

  const { data: hash, error, isPending, writeContract } = useWriteContract() 
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
      messageApi.open({
        type: 'error',
        content: '读取合约账户余额失败',
      })
    }
  }, [contractAddress, messageApi])

  // 读取消息列表
  const getTodoList = useCallback(async () => {
    setLoading(true)
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
        })
        setTodoList(dataSource)
      }
    } catch (error) {
      console.error('error', error)
      messageApi.open({
        type: 'error',
        content: '读取消息列表失败',
      })
    }
    setLoading(false)
  }, [contractAddress, messageApi])

  useEffect(() => {
    const timer = setInterval(() => {
      getBalance()
      getTodoList()
    }, 5000)
    getBalance()
    getTodoList()
    return () => {
      clearInterval(timer)
    }
  }, [getBalance, getTodoList])

  // 我要提款
  const getWithdraw = async () => {
    console.log('getWithdraw')
    try {
      readContract(config, {
        account: address,
        address: contractAddress,
        abi: contractABI.abi,
        functionName: 'withdraw',
      }).then(result => {
        console.log('我要提款', result)
      })
    } catch (error) {
      console.error('error', error)
      messageApi.open({
        type: 'error',
        content: '读取提款失败',
      })
    }
  }

  // 发布消息
  const publishMsg = () => {
    setIsLoading(true)
    writeContract({
      abi: contractABI.abi,
      address: contractAddress,
      functionName: 'published',
      args: [msg.trim()],
      value: parseEther('0.1'),
    })
    setMsg('')
  }

  // 监听消息发布
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value)
  }

  const showTotal: (total: number, range: [number, number]) => ReactNode = (total, range) => {
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
        <span>合约账户余额：<em>{ balance || '0.0' }</em> { balanceData?.symbol }</span>
        {/* <Button type="primary" ghost onClick={getBalance}>查询余额</Button> */}
        <Button type="primary" onClick={getWithdraw}>我要提款</Button>
      </div>
      <div className='item'><span>当前区块高度：{blockNumber?.toString() || '-'}</span></div>
      <div className="item">
        <Input value={msg} count={{
          show: true,
          max: 50,
        }} maxLength={50} placeholder="请输入消息内容" onInput={handleChange}></Input>
        <Button type='primary' loading={isLoading && isPending} onClick={publishMsg} disabled={isPending || !msg }>{isPending ? '确认中...' : '发布消息'}</Button>
      </div>
      {hash && (
        <div className='item'>
          <Tooltip title={hash}>
            <span>交易哈希: {formatTxHash(hash)}</span>
          </Tooltip>
        </div>
      )}
      {isConfirming && (
        <div className='item'>
          <Tag icon={<SyncOutlined spin />} color="processing">
            交易确认中...
          </Tag>
        </div>
      )} 
      {isConfirmed && (
        <div className='item'>
          <Tag icon={<CheckCircleOutlined />} color="success">
            交易已确认
          </Tag>
        </div>
      )} 
      {error && ( 
        <div className='item'>
          <span className='error'>错误回调: {(error as BaseError).shortMessage || error.message}</span>
        </div> 
      )} 
      <div className="total">
        <Table loading={loading} columns={columns} dataSource={todoList} pagination={{ pageSize: 6, showTotal }} />
      </div>
    </div>
  )
}

export default Todo
