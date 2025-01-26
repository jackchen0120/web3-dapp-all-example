/*
 * @description: 描述信息
 * @author: Jack Chen @懒人码农
 * @Date: 2025-01-24 00:31:21
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-01-26 21:30:56
 */
interface Window {
  solana: {
    isPhantom: boolean;
    connect: () => Promise<void>;
    isConnected: () => boolean;
    on: (event: string, callback: (publicKey: string) => void) => void;
    publicKey: string;
  };
  solflare: {
    isConnected: () => boolean;
    publicKey: string;
  };
}
