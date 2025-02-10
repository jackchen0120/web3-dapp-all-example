/*
 * @description: eslint 配置文件
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 22:54:41
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-09 23:17:07
 */
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  "@typescript-eslint/no-unused-vars": 1
];

export default eslintConfig;
