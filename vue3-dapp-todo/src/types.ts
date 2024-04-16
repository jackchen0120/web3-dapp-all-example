/*
 * @description: 接口类型声明
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-15 22:25:42
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-17 02:07:46
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

export const contractAddr = "0x3B6F03E52559c8B52c179Cfef4dBD99d549fb2d7";

export interface AccountProps {
  account: string;
}
