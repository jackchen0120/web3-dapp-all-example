/*
 * @description: 工具函数
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-23 23:48:07
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-24 01:23:57
 */

export const formatAddress = (address?: string) => {
  if (!address) return null;
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
};

export const formatTxHash = (tx?: string) => {
  if (!tx) return null;
  return `${tx.slice(0, 6)}…${tx.slice(38, 66)}`;
};

export const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const y = date.getFullYear();
  const m = date.getMonth() + 1; // 月份从0开始，需要加1
  const d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const min =
    date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const s =
    date.getSeconds() > 10 ? date.getSeconds() : `0${date.getSeconds()}`;
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};
