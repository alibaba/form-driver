import React, { Children } from "react";
import { message, Checkbox } from 'antd';
import { MUtil } from '../../src/framework/MUtil';
import { MFieldSchema } from "../../src/framework/Schema";
import { MViewerDebug } from "../../src/framework/MViewerDebug";
import { SubmitBar } from "../../src/framework/MViewer";

let database = {
  "type": "案例班",
  "exp": [
    {}
  ],
  "poster": "/academy/oss/secObject/course/1613636099539.png",
  "classList1": [{ "id": 63, "name": "11212", "bizType": 1, "bizId": 519, "packageId": null, "packageName": "啊啊啊啊啊啊啊啊" }, { "id": 64, "name": "问问", "bizType": 1, "bizId": 519, "packageId": null, "packageName": "啊啊啊啊啊啊啊啊" }],
  "briefList":   [
    {title:"1606997544611", content:"阿里巴巴"},
    {title:"1606997544222", content:"阿里巴巴2"},
  ]
}

export class CreateCourse extends React.Component<any, any> {
  render() {
    const mixEnum = [{ label: "true", value: true }, { label: "false", value: false }, { label: "number1", value: 1 }, { label: "str", value: "str" }];
    let schema: MFieldSchema = {
      name: "quest",
      type: "object",
      column: 2,
      objectFields: [
        {
          label: "绩联类型", name: "cascade", required: true, type: "cascade", placeholder: "请输入类型",
          enumFields: [
            {label: 'jiangsu', value:'jiangsu', children:[
              {label: 'nanjing', value:'nanjiong, chi', children:[
                {label: 'nanjing', value:'zhong hua men'}
              ]}
            ]}
          ]
        },
        { label: "课程名称", name: "name", type: "string" },
        { label: "是否收费", name: "free", type: "enum", enumFields: [{ label: "收费", value: true }, { label: "免费", value: false }] },
        { label: "价格", name: "price", type: "float", postfix: "元", showIf: "free==true" },
        { label: "课程类型", name: "type", type: "enum", enumFields: "实战营 案例班", enumOpen: { label: "其他", type: "string" } },
        // { label: "关联课程包", name: "bagLink", type: "enum", enumFields: "是 否" },
        // { label: "课程包班级", name: "bagClass", type: "string" },

        // { label: "名额", name: "n", type: "int" },
        // { label: "问卷id", name: "wj", type: "int" },
        // { label: "报名时间", name: "applyRange", type: "dateRange" },
        // { label: "名单确认时间", name: "confirm", type: "datetime" },

        // { label: "授课人", name: "teacher", type: "string" },
        // { label: "教练", name: "coach", type: "string" },
        // { label: "上课时间", name: "teachRange", type: "dateRange" },
        // { label: "上课地点", name: "teachAddress", type: "cnAddress" },

        // {
        //   label: "简介", name: "brief", type: "array", editor: "AArrayGrid", arrayMember: {
        //     type: "string",
        //     stringLines: 10,
        //     label: "内容"
        //   }
        // },
        // {
        //   label: "测试", name: "test", type: "array", editor: "ARemoteSelector", placeholder: "aaa",
        //   remote: {
        //     url: "/academy/hom/lyg/archive/search?keywords=${q}",
        //     dataPath: "data.list",
        //     valuePath: "id",
        //     labelExpr: "name + '(' + brief + ')'"
        //   }
        // },

        // { label: "默认", name: "defaultTillNow", type: "dateRange" },
        // { label: "有至今", name: "noTillNow", type: "dateRange", dateRange: { hideTillNow: false } },
        // { label: "无至今", name: "tillNow", type: "dateRange", dateRange: { hideTillNow: true } },
        // {
        //   label: "经历", name: "exp", type: "experience", experience: {
        //     "members": [
        //       {
        //         "label": "公司名",
        //         "name": "companyName",
        //         "type": "string"
        //       },
        //       {
        //         "label": "职位",
        //         "name": "position",
        //         "type": "string"
        //       }
        //     ],
        //     "overlap": true
        //   }
        // },
        {
          label: "简介", name: "briefList", type: "array", editor: "AArrayGrid", arrayMember: {
            type: "object",
            column: 2,
            objectFields: [
              { label: "标题名称", name: "title", required: true, placeholder: '请输入标题', type: "string" },
              { label: "内容", name: "content", required: true, placeholder: '请输入内容', type: "string" },
            ]
          }
        },
        // {
        //   label: "课程包班级", name: "classList", required: true, type: "array", placeholder: "请输入", showIf: "ARadio===true", editor: "ARemoteSelector",
        //   remote: {
        //     url: "/academy/hom/training/package/group/query",
        //     dataPath: "data.list",
        //     valuePath: "id",
        //     labelExpr: "name"
        //   }
        // },
        // {
        //   label: "设置班级", name: "classList1", required: true, placeholder: '请输入班级名称如(全套班)', type: "array", editor: "AArrayGrid", arrayMember: {
        //     type: "object",
        //     // layout: "horizontal",
        //     // comma: "：",
        //     objectFields: [
        //       { label: "班级名", required: true, placeholder: "请输入班级名", name: "name", type: "string" },
        //     ]
        //   }
        // },
        // { label: "ACheckbox:", name: "ACheckbox", type: "set", setFields: mixEnum },
        // { label: "ARadio", name: "ARadio", type: "enum", enumFields: mixEnum, enumOpen: { label: "other", type: "string" }, editor: "ARadio" },
        // { label: "ASelector", name: "ASelector", type: "enum", enumFields: mixEnum, enumOpen: { label: "other", type: "string" }, editor: "ASelector" },
        // { label: "ASetSelector", name: "ASetSelector", type: "set", editor: "ASetSelector", setFields: mixEnum },
        // {label: "AMatrix", name:"AMatrix", type: "matrix", // 暂不支持
        //   matrix: {y:"Y1 Y2", x: mixEnum, minX: 1},
        //   screenAdaption: "big"
        // }
      ],
      uispec: {
        type: "segmentForm",
        layout: "horizontal",
        comma: "：",
        segments: [
          // {label:"测试效果", fields: ["briefList", "classList", "classList1", "test", "defaultTillNow", "noTillNow", "tillNow", "exp"]},
          // {label:"不同类型候选值", fields: ["ACheckbox", "ARadio", "ASelector", "ASetSelector"]},
          { label: "基础信息", fields: ["cascade", "name", "type"]},
          { label: "价格", fields: ["free", "price"]},
          // { label: "报名规则", fields: ["n", "wj", "applyRange", "confirm"] },
          // { label: "课程安排", fields: ["teacher", "coach", "teachRange", "teachAddress"] },
          { label: "课程详情", fields: ["briefList"] },
        ]
      }
    };

    schema.objectFields.forEach(e => e.required = true);// 全部都必填

    return <>
      {MUtil.validateSchema(schema).map(r => r.message).join(",")}
      <MViewerDebug schema={schema} database={database} morph="editor" formItemWrapper={(elem: React.ReactElement, schema: Partial<MFieldSchema>) => {
        // return <div style={{border: "1px solid red"}}>{elem}</div>
        return elem;
      }}>
        <SubmitBar onSubmit={async (d: any) => {
          return new Promise(function (resolve, reject) {
            setTimeout(() => {
              // message.error("提交失败");
              // reject("提交失败");
              message.success("提交成功");
              resolve(null);
            }, 5000);
          });
        }} />
      </MViewerDebug>
    </>
  }
}
