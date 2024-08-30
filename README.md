# DZMAutoxjsScripts

- 自用 autojs 脚本

- 脚本按项目形式创建，是为了方便 `js` 模块之间的互相调用，如果想合成一个脚本文件，也可以的，将使用到的所有模块放在一起即可。

- 目录结构

  ```bash
  ├── node_modules            # 语法提示文件（可删除）
  ├── dingding_dk             # 项目目录（钉钉打卡）
        ├── tsconfig.json     # 语法提示关联文件（可删除）
        ├── main.js           # 项目入口文件
        ├── utils.js          # 项目工具文件
        ├── project.json      # 项目配置文件
        └── ....              # 可以自行根据项目需要，创建层级文件夹管理
  ├── dingding_hb             # 项目目录（钉钉红包）
  ```
