import React, { useState, useEffect } from "react";
import { M3, SubmitBar, useForm } from "../../src";
import { message } from 'antd';

let db = {
  "participantList": [
    {
      "archiveId": {
        "value": 37160,
        "label": "柳青(青青) / 北京小桔科技有限公司"
      },
      "role": "哈哈光",
      "coConstructionTime": 2
    }
  ],
  "archiveId": {
    "value": 37160,
    "label": "柳青(青青) / 北京小桔科技有限公司"
  },
  briefList: [{ name: '乙方', auth: '签署', main: '使用模板指定', require: '手绘章，模板章' }]
}
const TestForm2 = () => {
  const form = useForm()
  useEffect(() => {
  }, []);

  return <div>
    <M3
      form={form}
      morph={'editor'}
      debug={true}
      schema={{
        name: 'quest',
        type: 'object',
        objectFields: [
          {
            "label": "问卷名字",
            "name": "name",
            "max": 50,
            "type": "string",
            "required": true
          },
          {
            "label": "标题栏名字",
            "name": "browserTitle",
            "max": 50,
            "type": "string",
            "required": true,
            "defaultValue": "湖畔问卷"
          },
          {
            "label": "开始时间",
            "name": "startTime",
            "type": "datetime",
            "dataFormat": "x",
            "required": true
          },
          {
            "label": "截止时间",
            "name": "endTime",
            "type": "datetime",
            "dataFormat": "x",
            "required": true
          },
          {
            "label": "管理员",
            "name": "managerList",
            "required": true,
            "type": "array",
            "placeholder": "请输入",
            "editor": "ARemoteSelector",
            "remote": {
              "url": "/academy/hom/new_user/queryByAccountOrName?kw=${q}&orgIds=6",
              "dataPath": "data",
              "valuePath": "id",
              "labelExpr": "name"
            }
          },
          {
            "type": "enum",
            "name": "reserveHistory",
            "label": "保留提交历史",
            "layoutHint": "h",
            "editor": "ARadio",
            "defaultValue": false,
            "option": [
              {
                "label": "是",
                "value": true
              },
              {
                "label": "否",
                "value": false
              }
            ]
          },
          {
            "type": "enum",
            "name": "needLogin",
            "label": "需要登录",
            "showIf": "reserveHistory==false",
            "layoutHint": "h",
            "editor": "ARadio",
            "defaultValue": false,
            "option": [
              {
                "label": "是",
                "value": true
              },
              {
                "label": "否",
                "value": false
              }
            ]
          },
          {
            "label": "提交成功提示语",
            "name": "successTips",
            "type": "string",
            "stringLines": 3,
            "max": 50
          },
          {
            "label": "注释",
            "name": "comment",
            "type": "string",
            "stringLines": 5
          },
          {
            name: "briefList", type: "array", editor: "AArrayGrid", min: 1,
            arrayMember: {
              type: "object", uispec: {
                layout: "horizontal", comma: "：", type: "segmentForm"
              },
              objectFields: [
                { label: "参与方", name: "name", defaultValue: '乙方', editor: 'DivViewer', type: "string" },
                { label: "权限", name: "auth", defaultValue: '签署', editor: 'DivViewer', type: "string" },
                { label: "参与主体：个人", name: "main", defaultValue: '使用模板指定', editor: 'DivViewer', type: "string" },
                { label: "姓名", name: "personName", type: "string", required: true },
                { label: "手机号", name: "personPhone", type: "tel", required: true },
                { label: "公司", name: "personName", type: "string", required: false },
                { label: "职位", name: "personPhone", type: "string", required: false },
                { label: "签署要求", name: "require", defaultValue: '手绘章，模板章', editor: 'DivViewer', type: "string" },
              ]
            }
          },
        ]
        // {
        //   name: "participantList", type: "array", editor: "AArrayGrid",
        //   arrayMember: {
        //     column: 3,
        //     // 新增时指定带下来的字段
        //     copyFields: ['role', 'coConstructionTime'],
        //     objectFields: [
        //       {
        //         label: "人物档案", name: "archiveId", placeholder: '请选择人物档案', type: "vl", editor: "ARemoteSelector", required: true,
        //         remote: {
        //           url: "/academy/hom/lyg/archive/search?type=1&keywords=${q}",
        //           dataPath: "data.list",
        //           valuePath: "id",
        //           labelExpr: "name +  ' / ' + brief"
        //         }, readable: 'A', a: {
        //           labelExpr: (val) => {
        //             console.log('lableExpr:' + String(val))
        //             return <span>fdasfasa</span>
        //           },
        //           onClick: (val) => {
        //             window.open(`/#/archive-detail?id=${val.value}`)
        //           }
        //         }
        //       },
        //       { label: "角色", name: "role", type: "string", required: true, },
        //       { label: "共建时", name: "coConstructionTime", type: "int" },
        //     ]
        //   }
        // },
        //   {
        //     label: "人物档案", name: "archiveId", placeholder: '请选择人物档案', type: "vl", editor: "ARemoteSelector", required: true,
        //     remote: {
        //       url: "/academy/hom/lyg/archive/search?type=1&keywords=${q}",
        //       dataPath: "data.list",
        //       valuePath: "id",
        //       // labelExpr: "name +  ' / ' + brief",
        //       labelExpr: (val) => {
        //         console.log('lableExpr:', val)
        //         // return <span>{val.name +  ' / ' + val.brief}</span>
        //         return  val.name +  ' / ' + val.brief
        //       },
        //     }, readable: 'A', a: {
        //       labelExpr: (val, p) => {
        //         console.log('lableExpr:', val, p)
        //         return <span>{val.label}</span>
        //       },
        //       onClick: (val) => {
        //         window.open(`/#/archive-detail?id=${val.value}`)
        //       }
        //     }
        //   },
        // ],
        // uispec: {
        //   type: "segmentForm",
        //   layout: "horizontal",
        //   comma: "：",
        //   segments: [
        //     { label: "参与人信息", fields: ["participantList"] }
        //     // { label: "资料信息", fields: ["resourceList"] },
        //   ]
        // }
      }
      }
      database={db}>
      <SubmitBar onSubmit={async (d: any) => {
        return new Promise(function (resolve, reject) {
          console.log('testform2-form', form);
          setTimeout(() => {
            message.success("提交成功");
            resolve(null);
          }, 5000);
        });
      }} />
    </M3>
    <div style={{ padding: '30px' }}>
      <button style={{ padding: '10px' }} onClick={() => {
        form.setSchema({
          name: 'afda',
          type: 'object',
          objectFields: [
            {
              "label": "提交成功提示语",
              "name": "successTips",
              "type": "string",
              "stringLines": 3,
              "max": 50
            },
            {
              "label": "注释",
              "name": "comment",
              "type": "string",
              "stringLines": 5
            },
          ]
        })
      }}>form.setSchema</button>
      <button style={{ padding: '10px' }} onClick={() => {
        form.setDatabase({
          briefList: [
            {
              "name": "乙方",
              "auth": "签署",
              "main": "使用模板指定",
              "require": "手绘章，模板章",
              "personName": '姓名-必填',
              "personPhone": '电话-必填',
              "company": '企业名称',
              "position": '职位',
            },
            {
              "name": "乙方",
              "auth": "签署",
              "main": "使用模板指定",
              "require": "手绘章，模板章",
              "personName": '姓名-必填1',
              "personPhone": '电话-必填2',
              "company": '企业名称3',
              "position": '职位4',
            },
          ]
        })
      }}>form.setDatabase</button>
      <button style={{ padding: '10px' }} onClick={() => {
        console.log(form.getSchema())
      }}>form.getSchema</button>
      <button style={{ padding: '10px' }} onClick={() => {
        console.log(form.getDatabase())
      }}>form.getDatabase</button>
    </div>
  </div >
}
export default TestForm2