---
order: 1
group:
  order: 2
  title: 协议（schema）
toc: content
---

## schema 规范

schema 是 `<M3/>` 的必填 props，用于描述表单的基本信息、结构和校验，是一个 json 。

### 基础属性 

描述表单结构的数据，每种输入框的 `schema` 各有不同，但都具有一些公共的基础属性：

key | value | 是否必填 | 描述 | 
--- | --- | --- | --- | 
type | `string` | 是 | 数据类型 
name | `string` | 是 | 字段名
label| `string` | 否 | 标签名
require | `boolean` |否| 是否必填
defaultValue | `string` \| `boolean` \| `number` | 否 | 默认值
editor | `string` \| `VIEWER` | 否 | 编辑器（编辑模式下的渲染器）
readable | `string` \| `VIEWER` | 否 | 阅读器（阅读模式下的渲染器）
props | `object` | 否 | 表单控件的属性（包含 antd 组件的 api）
showIf | `string` | 否 | 是否展示的表达式

