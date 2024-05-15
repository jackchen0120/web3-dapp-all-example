/*
 * @description: 链信息卡片组件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-15 10:27:02
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-15 10:59:47
 */
'use client';

import { Spin } from 'antd';
import cx from 'classnames';
import { useBlockNumber, useEstimateFeesPerGas } from 'wagmi'

function ChainCard({className, chain}: {className?: string, chain: any}) {
  const { data: blockNumber, isLoading: isBlockNumberLoading} = useBlockNumber({ chainId: chain.id, watch: true });
  const { data: gasPriceInfo, isLoading: isGasPriceLoading } = useEstimateFeesPerGas({ chainId: chain.id });

  return (
    <div className={cx(className)}>
      <table border={1} className="mt-3">
        <tbody>
          <tr>
            <td>链名: </td><td><label className="color-blue">{chain.name}</label></td>
          </tr>
          <tr>
            <td>链ID: </td><td><label className="color-blue">{chain.id}</label></td>
          </tr>
          <tr>
            <td>区块浏览器：</td><td width={400}><a href={chain.blockExplorers?.default?.url} className="color-blue">{chain.blockExplorers?.default?.url}</a></td>
          </tr>
          <tr>
            <td>原生代币: </td><td><label className="color-blue">{chain.nativeCurrency?.name} ({chain.nativeCurrency?.symbol})</label></td>
          </tr>
          <tr>
            <td>区块高度:</td><td><label className="color-blue">{ isBlockNumberLoading ? <Spin /> : (blockNumber)?.toString?.() }</label></td>
          </tr>
          <tr>
            <td>每种燃料的最高费用（EIP-1559交易）：</td><td><label className="color-blue">{ isGasPriceLoading ? <Spin /> : gasPriceInfo?.formatted?.maxFeePerGas } gwei</label></td>
          </tr>
        </tbody>
      </table>
  </div>
  )
}

export default ChainCard