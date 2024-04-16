/*
 * @description: 接口类型声明
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-15 22:25:42
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-16 02:05:17
 */
declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
  }
}

interface MetaMaskProvider {
  isMetaMask: boolean;
  isConnected: () => boolean;
  request: (request: {
    method: string;
    params?: any[] | undefined;
  }) => Promise<any>;
  on: (event: string, callback: (param: any) => void) => void;
}

export interface ITodo {
  id: Number;
  author: string;
  message: string;
  timestamp: Number;
}

export class Todo implements ITodo {
  public id: Number;
  public author: string;
  public message: string;
  public timestamp: Number;

  constructor(id: Number, author: string, message: string, timestamp: Number) {
    this.id = id;
    this.author = author;
    this.message = message;
    this.timestamp = timestamp;
  }
}

export const contractAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export interface AccountProps {
  account: string;
}
