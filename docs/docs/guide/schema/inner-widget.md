---
order: 4
toc: content
---

## 内置组件

目前 M3 已经支持的内置组件的展示，见 [playground](/playground) - 基础控件

使用 type 和 editor 表示一个表单控件：



组件名称 | type | editor 
--  |  --  |  -- 
输入框 | string |  AInputBox
整数输入框 | int | AIntBox
小数输入框 | float | AIntBox
下拉单选 | enum | ASelector
点击单选 | enum | ARadio
下拉多选 | set | ASetSelector
点击多选 | set | ACheckBox
时间选择 | datetime | ADatetimePicker
年份选择 | year | ADatetimePicker
年月选择 | yearMonth | ADatetimePicker
年月日选择 | yearMonthDay | ADatetimePicker
时间范围 | dateRange | ARangePicker
远程下拉多选 | array |  ARemoteSelector
远程下拉单选 | vl |  ARemoteSelector
五星评分 | int | ARate 
NPS打分 | int | NPS 
城市选择 | gb2260 | AGB2260 
地址选择 | cnAddress | ACnAddress 
联级选择 | cascade |  ACascadePicker
矩阵选择 | array |  AArrayGrid
经历选择 | experience |  AExperience


## 官方插件

[富文本](http://gitlab.alibaba-inc.com/hupanopen/m3-plugin-richtext)

[文件上传](http://gitlab.alibaba-inc.com/hupanopen/m3-plugin-hp-ossfile)

[湖畔组织的下拉选择框](http://gitlab.alibaba-inc.com/hupanopen/m3-plugin-hp-org)
