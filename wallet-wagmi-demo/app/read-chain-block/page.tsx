/*
 * @description: 获取链和区块组件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-05-15 10:23:39
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-05-15 11:03:33
 */
'use client';

import { Select } from 'antd';
import React from 'react';
import { useChains } from 'wagmi';
import ChainCard from '../components/ChainCard';

export default function Page() {
  const chains = useChains();
  const [selectedId, setSelectedId] = React.useState();
  const selectedChain = chains.find(t => t.id === selectedId) || null;

  return (
    <div>
      <div className="flex flex-row justify-center items-center">
      请选择一条链: <Select value={selectedId} onChange={setSelectedId} className="mx-2 w-40" placeholder="链" options={chains.map(t => ({ label: t.name, value: t.id }))}/>
    </div>
    { selectedChain && <ChainCard chain={selectedChain} /> }
    </div>
  )
}