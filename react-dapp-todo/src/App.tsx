/*
 * @description: 主组件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-22 23:10:05
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-22 23:26:54
 */
import './App.css'
import { useAccount } from 'wagmi'
import Header from './components/Header'
import Todo from './components/Todo'

function App() {
  const { isConnected } = useAccount()
  console.log('isConnected', isConnected)

  return (
    <div className="App">
      <Header />
      <Todo />
    </div>
  )
}

export default App
