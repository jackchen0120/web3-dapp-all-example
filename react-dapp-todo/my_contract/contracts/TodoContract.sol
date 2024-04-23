// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

// 使用console.log()输出日志
import "hardhat/console.sol";

// 合约功能：实现一个简单的待办事项合约，包括发布待办事项、查看待办事项列表、发送以太币到合约等功能。

// 合约名：TodoContract
contract TodoContract {
    struct Todo {
        uint256 id;
        address author;
        string message;
        uint256 timestamp;
    }

    // 事件：NewTodo，用于记录新创建的待办事项
    event NewTodo(
        uint256 todoID,
        address indexed from,
        string message,
        uint256 timestamp
    );

    // 事件：SendMoneyToContract，用于记录向合约发送以太币的事件
    event SendMoneyToContract(
        uint256 todoID,
        address receiver,
        string message,
        uint256 timestamp
    );

    // 状态变量：todoID，用于记录待办事项的ID
    // 状态变量：todoList，用于存储待办事项列表
    // 状态变量：owner，用于记录合约的拥有者
    uint256 public todoID;
    Todo[] public todoList;
    address payable public owner;

    // 构造函数：初始化合约时设置合约的拥有者
    constructor() payable {
        owner = payable(msg.sender);
    }

    // 修饰符：onlyOwner，用于限制只有合约的拥有者才能调用该函数
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "\u5fc5\u987b\u662f\u5408\u7ea6\u6240\u6709\u8005"
        );
        _;
    }

    // 函数：withdraw，用于提取合约中的以太币
    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    // 函数：getBalance，用于查询合约中的以太币余额
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // 函数：getTodoList，用于获取待办事项列表
    function getTodoList() public view returns (Todo[] memory) {
        return todoList;
    }

    // 函数：published，用于发布新的待办事项
    function published(string memory _message) public payable {
        todoID += 1;
        Todo memory item = Todo(todoID, msg.sender, _message, block.timestamp);
        todoList.push(item);
        emit NewTodo(todoID, msg.sender, _message, block.timestamp);

        uint256 payAmount = 0.1 ether;
        console.log(
            "publish todo, payAmount: %s, msg.value: %s",
            msg.value,
            payAmount
        );
        require(msg.value >= payAmount, "\u4f59\u989d\u4e0d\u8db3");
        (bool success, ) = payable(address(this)).call{value: payAmount}("");
        require(success, "\u5411\u5408\u7ea6\u6c47\u6b3e\u5931\u8d25");
        emit SendMoneyToContract(todoID, msg.sender, _message, block.timestamp);
    }

    // 函数：receive，用于接收以太币
    receive() external payable {}
}
