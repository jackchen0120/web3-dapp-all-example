/*
 * @description: 主入口文件
 * @author: Jack Chen @懒人码农
 * @Date: 2024-04-11 21:24:03
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-04-16 22:48:40
 */
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./style.css";
import App from "./App.vue";

createApp(App).use(ElementPlus).mount("#app");
