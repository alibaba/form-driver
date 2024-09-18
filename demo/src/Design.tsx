import React, { useState, useEffect } from "react";
import Designer from "./Designer/index";

const Design = () => {
  const [curSchema, setCurSchema] = useState([
    {
      "editor": "NPS",
      "npsType": 1,
      "icon": "nps",
      "name": "t_8BE44342",
      "id": 39787,
      "label": "我对本次课程的收获感打分是？",
      "type": "int",
      "label2": "课程评价NPS",
      "tooltips": "课程评价NPS，该数据会计入课评NPS报表中",
      "relevance": {},
      "props": {
        "remark": "0-4分完全没有收获，5-6分有少量收获，7-8分有收获，9-10分极有收获。",
        "leftTip": "没有收获",
        "rightTip": "极有收获"
      }
    },
    {
      "editor": "AInputBox",
      "name": "t_7CF22A01",
      "id": 39838,
      "label": "开心",
      "placeholder": "请填写",
      "type": "string",
      "relevance": {}
    },
    {
      "editor": "NPS",
      "npsType": 2,
      "icon": "nps",
      "name": "t_6DAB8247",
      "archive": {
        "label": "叔常日常(湖畔黑衣人)",
        "value": 75839
      },
      "label": "我对叔常日常老师的评1",
      "id": 39786,
      "type": "int",
      "label2": "老师评价NPS",
      "relevance": {},
      "tooltips": "老师评价NPS，该数据会计入老师NPS报表中",
      "props": {
        "leftTip": "没有帮助",
        "rightTip": "非常认可"
      }
    }
  ]
  )
  const [designItem, setDesignItem] = useState({
    "id": 3832,
    "gmtCreate": 1723453402000,
    "gmtModified": 1726122232000,
    "uniqueId": "ajvQTF",
    "name": "测试test",
    "displayConfiguration": {
      "reserveHistory": false,
      "browserTitle": "湖畔问卷",
      "needLogin": false,
      "successTips": ""
    },
    "shareConfiguration": null,
    "startTime": 1726122223000,
    "endTime": 1730538190000,
    "bizType": null,
    "bizId": null,
    "type": 0,
    "bizExtension": {
      "comment": ""
    },
    "permission": 0,
    "unitList": null,
    "resultCount": 0,
    "hasPermission": true,
    "managerList": [
      {
        "id": 610393,
        "name": "孟汉光",
        "company": null
      }
    ],
    "creator": {
      "id": 610393,
      "name": "孟汉光",
      "company": null
    },
    "modifier": null,
    "state": 1,
    "copyId": null,
    "templateId": 0,
    "templateName": null,
    "relationCourse": null
  })

  const editFormUnit = (unit) => {
    console.log(unit)
    return Promise.resolve(unit)
  }

  useEffect(() => {

  }, []);

  return <div>
    {/* 问卷设计器 */}
    <Designer curSchema={curSchema} setCurSchema={setCurSchema} designItem={designItem} callback={editFormUnit}></Designer>
  </div >
}
export default Design