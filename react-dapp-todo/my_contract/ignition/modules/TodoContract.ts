import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TodoContractModule = buildModule("TodoContractModule", (m) => {
  const todoContract = m.contract("TodoContract");

  return { todoContract };
});

export default TodoContractModule;
