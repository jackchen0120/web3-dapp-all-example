/*
 * @description: tab选项卡组件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-10 00:18:20
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-10 00:18:45
 */
"use client";

import { ReactNode, useState } from "react";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex space-x-4 border-b border-gray-700 md:text-base text-xs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 px-4 focus:outline-none ${
              activeTab === index ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400 hover:text-blue-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[activeTab].content}</div>
    </div>
  );
}

export default Tabs;
