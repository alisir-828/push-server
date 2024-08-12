# Push Server

搭建本服务是为了提供消息推送的相关功能，一个基于 rpc 的消息处理平台。

## 📥 如何使用

### 运行

```bash
npm run dev
```

### 打包

```bash
npm run build
```

### 生成接口文档

```shell
npm run doc
```

### 单元测试

```bash
npm run test
```

---

## **📊 目录结构**

``` bas
├──  src
│    ├── common                   # 公共文件、常量业务报错等
│    ├── config                   # 配置文件
│    ├── db                       # 数据库连接
│    ├── middleware               # 中间件
│    ├── shared                   # 前后端共享代码
│    │   ├── protocols            # 协议定义
│    │   ├── api                  # API 实现
│    ├── index.ts                 # 启动文件
│    ├── tsrpc.config.ts          # TSRPC 项目配置文件
```
