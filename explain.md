# M3

解放表单开发的生产力

[使用文档](https://web.hupan.com/m3/index.html)

## Setup

``` bash
# 安装依赖
npm run i

# 本地开发
npm run dev

# 本地构建
npm run b

# 发布 tnpm 包
npm run pub
```

需要本地调试时，在**本地构建完成**后，执行

``` bash
yarn link
```

需要结束本地调试时，执行

``` bash
yarn unlink
```

## Catalogue

``` md
├── demo/                          # 演示页面目录
│   ├── src/                       # demo 源代码
│   └── dist/                      # demo 构建产物
├── docs/                          # M3 的文档
├── src/                           # M3 源代码
├── webpack.demo.js                # demo 开发与构建配置
├── rollup.config.js               # M3 构建配置
├── README.md
├── package.json
├── .gitignore
└── tsconfig.json
```

## 文档开发

m3 的文档在`docs`目录下开发，在`docs/.umirc.ts`配置文档目录结构，在`docs/docs/`书写文档内容。

```bash
# 安装文档依赖
npm run docs:i

# 启动本地文档预览
npm run docs:dev

# 文档构建于 docs/dist/
npm run docs:build

# 文档发布
npm run docs:pub
```

> 文档发布要求已全局安装 [`hupan-cli`](http://gitlab.alibaba-inc.com/hupandaxue/hupan-cli)，并已执行`hp osslogin`成功登录.

## 单元测试

```bash
cd ./demo/src/ut_autoTest/ut_case
git pull
source .venv/bin/Activate
python run_ui.py 
```

## ChangeLog

[M3 更新日志](https://web.hupan.com/m3/docs/changeLog.html)
