---
order: 1
title: 开始使用
toc: content
---
### Install

```bash
tnpm install --save form-driver
```

### Usage

```js
import 'form-driver/dist/m3.css';
import { M3, SubmitBar } from 'form-driver';

const MamDetail = () => {

    const schema = {
        name: 'root',
        type: 'object',
        objectFields: [
            { label: "项目名称", required: true, name: "title", type: "string", max: 50, placeholder: '请输入' },
            { label: "需求说明", name: "description", type: "string", stringLines: 3, placeholder: '请输入' },
        ]
    }

    const database = {
        title: 'M3',
        description: '解放表单开发的生产力'
    }

    return <M3 schema={schema} database={database} morph={'editor'}>
                <SubmitBar onSubmit={finalData => {
                    // 此处需要返回一个 promise
                    return new Promise((resolve, reject) => {
                    // 处理 finalData
                    }); 
                }} />
        </M3>
}
```


## M3 组件

```js
<M3 schema={schema} database={database} morph={'editor'} />
```
组件接受三个参数：`morph`、`database`、`schema`

### morph

取值： `editor` | `readable`

指定表单的形态， `editor` 表示编辑模式， `readable` 表示展示模式。

### database

描述表单输入结果的数据，以键值对的形式体现。

### schema

描述表单结构的数据。