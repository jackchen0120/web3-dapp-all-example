/*
 * @description: 用户交互组件（查询余额、提款、发布消息）
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-22 23:10:05
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-22 23:26:54
 */
// import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { type BaseError, useSendTransaction, useWaitForTransactionReceipt, useAccount, useReadContract, useBlockNumber, useBalance, useChainId, useEstimateFeesPerGas, useEstimateGas, useGasPrice } from 'wagmi'
// import { type Hex, parseEther, formatEther } from 'viem'
import contractABI from '../artifacts/contracts/TodoContract.sol/TodoContract.json'
import { Button, Input, Table, Space } from 'antd'
import type { TableProps } from 'antd'

interface DataType {
  id: string;
  author: string;
  message: number;
  timestamp: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <a>{text}</a>,
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
    render: (_, record) => (
      <Space size="middle">
        <a>{record.timestamp}</a>
      </Space>
    ),
  },
];

const data: DataType[] = [];

function Todo() {
  const { address } = useAccount()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  // const chainId = useChainId()
  const { data: balance } = useReadContract({
    abi: contractABI.abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: 'getBalance',
  })
  // const addRecentTransaction = useAddRecentTransaction()
  // const { data: hash, error, isPending, sendTransaction } = useSendTransaction()
  // const balance = data ? formatEther(data?.value) : '0.0'
  console.log('address', balance)

  const getBalance = () => {
    console.log('getBalance')
  }

  const getWithdraw = () => {
    console.log('getWithdraw')
  }

  const publishMsg = () => {
    console.log('publishMsg')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChange', e.target.value)
  }

  return (
    <div className='main'>
      <div className="item">
        <span>合约账户余额：<em>{ balance?.toString() || '0.0' }</em></span>
        <Button type="primary" ghost onClick={getBalance}>查询余额</Button>
        <Button type="primary" onClick={getWithdraw}>我要提款</Button>
      </div>
      <div className="item">
        <Input v-model="msg" placeholder="请输入消息内容" onInput={handleChange}></Input>
        <Button onClick={publishMsg} disabled>发布消息</Button>
      </div>
      <div className="total">
        <h3>统计：{ 1 }</h3>
        <Table columns={columns} dataSource={data} />
      </div>
    {/* <el-table :data="todoList" style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="author" label="接收者" minWidth="180" />
      <el-table-column prop="message" label="消息" minWidth="120" />
      <el-table-column prop="timestamp" label="时间戳">
        <template #default="scope">
          {{ timestampToDate(Number(scope.row.timestamp)) }}
        </template>
      </el-table-column>
    </el-table> */}
    </div>
  )
}

export default Todo
