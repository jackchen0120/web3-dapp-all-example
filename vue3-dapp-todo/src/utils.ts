/*
 * @description: 工具函数
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-16 22:09:17
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-17 02:55:28
 */
export const timestampToDate = (timestamp: number) => {
  let date = new Date(timestamp * 1000);
  let y = date.getFullYear();
  let m = date.getMonth() + 1; // 月份从0开始，需要加1
  let d = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`;
  let h = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`;
  let min =
    date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  let s = date.getSeconds() > 10 ? date.getSeconds() : `0${date.getSeconds()}`;
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};
