/*
 * @description: 部署合约配置
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-16 00:34:06
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-16 02:03:43
 */
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TodoContractModule = buildModule("TodoContractModule", (m) => {
  const todoContract = m.contract("TodoContract");

  return { todoContract };
});

export default TodoContractModule;
