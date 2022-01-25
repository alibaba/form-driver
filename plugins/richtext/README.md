# form-driver-plugin-richtext

m3 的富文本插件，基于 quill 封装

## 使用案例

``` js
import 'form-driver/dist/m3.css'
import { assembly, M3 } from 'form-driver';
import "form-driver-plugin-richtext/dist/index.css";
import RichText from "form-driver-plugin-richtext";

// 在 m3 中注册文本插件
assembly.addType(RichText);

const schema = {
    type: "object",
    objectFields: [{
        label: "简介",
        name: "p_brief2",
        type: "string",
        editor: 'RichText', // 在这里可以指定富文本插件
        options: {
            minHeight: '100px',
            quillOptions: {
                placeholder: '请输入简介',
            }
        }
    }]
}

const database = {
    p_brief2: "m3 的富文本插件"
}

export function() {
    return <M3 schema={schema} database={database} morph = "editor"/>
}
```

### options

| key | value | description |
| --- | --- | --- |
| minHeight | String | 选填，输入区域最小高度 |
| maxHeight | String | 选填，输入区域最大高度 |
| changeHandle | Function | 选填，输入变化后的回调，第一个参数为输入值 |
| srcFormat | Function | 选填，格式化数据源，默认`srcFormat: src => src` |
| resFormat | Function | 选填，格式化返回结果，默认`resFormat: res => res` |
| quillOptions | Object | 选填，[quill 的配置](https://quilljs.com/docs/configuration/#options)， `quillOptions.modules.toolbar` 优先级高于 `useImage` 和 `useVideo` |

## 本地开发

``` bash
# 安装依赖
yarn

# 本地开发 
yarn run dev

# 本地构建
yarn run b

# 发布 tnpm 包
yarn run pub
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
├── src/                           # 源代码
├── webpack.demo.js                # demo 开发与构建配置
├── rollup.config.js               # 构建配置
├── README.md
├── package.json
├── .gitignore
└── tsconfig.json
```

