import _ from "lodash";
// import { DecorationSegmentLabel } from './DecorationSegmentLabel'
// import DecorationHtml from './DecorationHtml'
// import DecorationImg from './DecorationImg'
import { OpenOption } from "./OpenOption";
import { NpsProps } from "./NpsProps";
import { RateProps } from "./RateProps";
import { OssuploadProps } from "./OssuploadProps";

/**
 * a : database
 * v : newValue
 * 跟lodash的set一样，除了path是""时等效于_.assign(a, v)
 */
function set(a, path, v) {
  if (path === "") {
    // 如果 database 是数组，需要特殊处理
    if (_.isArray(a)) a.length = v.length;
    _.assign(a, v);
  } else {
    _.set(a, path, v);
  }
}

export const unitEnum = [
  { type: "enum", label: "单选", editor: "ARadio", option: [] },
  { type: "set", label: "多选", editor: "ACheckBox", option: [] },
  { type: "set", label: "排序题", editor: "AACheckDrag", option: [] },
  { type: "string", label: "文本", editor: "AInputBox" },
  { type: "tel", label: "手机号", editor: "ASpecInputBox", icon: "mobile" },
  { type: "email", label: "邮箱", editor: "ASpecInputBox", icon: "email" },
  { type: "int", label: "整数", editor: "AIntBox", icon: "segmentLabel" },
  { type: "int", label: "评分", editor: "ARate", icon: "rate" },
  { type: "int", label: "NPS", npsType: 0, editor: "NPS", icon: "nps" },
  {
    type: "int",
    label2: "课程评价NPS",
    npsType: 1,
    editor: "NPS",
    icon: "nps",
    tooltips: "课程评价NPS，该数据会计入课评NPS报表中",
  },
  {
    type: "int",
    label2: "老师评价NPS",
    npsType: 2,
    editor: "NPS",
    icon: "nps",
    tooltips: "老师评价NPS，该数据会计入老师NPS报表中",
  },
  {
    type: "decoration",
    label2: "分段标题",
    icon: "segmentLabel",
    decoration: {
      segmentLabel: "分段标题",
    },
  },
  {
    type: "decoration",
    label2: "图文展示",
    icon: "richDecoration",
    decoration: {
      HTML: "图文展示",
    },
  },
  {
    type: "decoration",
    label2: "设置头图",
    icon: "headImg",
    tooltips: "头图的宽度在移动端会铺满屏幕，一般放置在问卷最顶部",
    decoration: {
      HTML: "<img class='headImage' src='https://online-academy.oss-cn-hangzhou.aliyuncs.com/img/hpwjbg.jpg?x-oss-process=image/resize,w_640/quality,q_50/format,jpg'/><p><br></p>",
    },
  },
  {
    type: "attachment",
    label: "附件上传",
    props: {
      maxSize: 100,
      maxAmount: 1,
    },
  },
];

export const valueLabel = {
  type: "object",
  name: "-",
  objectFields: [{ label: "文案", name: "label", type: "string" }],
};

export const generateItemSchema = (curSchema) => {
  if (!curSchema)
    return {
      name: `${type}Option`,
      type: "object",
      objectFields: [],
    };

  let base = [];
  const { type, decoration, editor } = curSchema;
  if (type === "decoration") {
    let subType = decoration?.subType;

    if (!subType) {
      if (_.isString(decoration?.HTML)) {
        subType = "rich";
      } else if (_.isString(decoration?.segmentLabel)) {
        subType = "segmentLabel";
      }
    }

    // if (subType === 'rich') {
    //     base = [
    //         { label: "", name: `decoration`, editor: curSchema.label2 === "图文展示" ? DecorationHtml : DecorationImg }
    //     ]
    // } else if (subType === 'segmentLabel') {
    //     base = [
    //         { label: "分段标题", name: `decoration`, editor: DecorationSegmentLabel }
    //     ]
    // }
  } else if (curSchema.label2 == "课程评价NPS") {
    base = [
      {
        label: "标题",
        name: "label",
        type: "string",
        defaultValue: "我对本次课程的收获感打分是？",
      },
      {
        label: "是否必填",
        layoutHint: "h",
        name: "required",
        type: "enum",
        editor: "ARadio",
        enumFields: [
          { label: "是", value: true },
          { label: "否", value: false },
        ],
      },
      {
        label: "描述文案",
        name: `props`,
        editor: NpsProps,
        defaultValue: {
          leftTip: "没有收获",
          rightTip: "极有收获",
          remark:
            "0-4分完全没有收获，5-6分有少量收获，7-8分有收获，9-10分极有收获。",
        },
      },
    ];
  } else if (curSchema.label2 == "老师评价NPS") {
    base = [
      {
        label: "标题",
        name: "label",
        type: "string",
        defaultValue: "我对老师的评价？",
      },
      {
        label: "请选择老师",
        name: "archive",
        type: "vl",
        editor: "ARemoteSelector",
        placeholder: "请输入",
        remote: {
          url: "/academy/hom/lyg/archive/search?keywords=${q}",
          dataPath: "data.list",
          valuePath: "id",
          labelExpr: "name+'('+brief+')'",
        },
        props: {
          allowClear: true,
          onChange: function (v) {
            let db = this.props.database;
            console.log("change archive", this);
            let c = "";
            if (v && v.label) {
              c = db.label.replace(
                /对(.*?)老师/,
                `对${v.label.split("(")[0]}老师`
              );
            } else {
              c = db.label.replace(/对(.*?)老师/, `对老师`);
            }
            set(this.props.database, "label", c);
            // this.props.changeDatabase(db)
          },
        },
      },
      {
        label: "是否必填",
        layoutHint: "h",
        name: "required",
        type: "enum",
        editor: "ARadio",
        enumFields: [
          { label: "是", value: true },
          { label: "否", value: false },
        ],
      },
      {
        label: "描述文案",
        name: `props`,
        editor: NpsProps,
        defaultValue: {
          leftTip: "没有帮助",
          rightTip: "非常认可",
        },
      },
    ];
  } else {
    base = [
      { label: "标题", name: "label", type: "string" },
      {
        label: "是否必填",
        layoutHint: "h",
        name: "required",
        type: "enum",
        editor: "ARadio",
        enumFields: [
          { label: "是", value: true },
          { label: "否", value: false },
        ],
      },
      editor === "ARate"
        ? {
            label: "星数",
            name: "max",
            type: "int",
            min: 1,
            max: 100,
            defaultValue: 5,
          }
        : null,
      editor === "ARate"
        ? { label: "描述文案", name: `props`, editor: RateProps }
        : null,
      editor === "NPS"
        ? { label: "描述文案", name: `props`, editor: NpsProps }
        : null,
      type === "string"
        ? {
            label: "输入提示",
            name: "placeholder",
            type: "string",
            defaultValue: "请填写",
            placeholder: "请填写输入提示",
          }
        : null,
      type === "set" || type === "enum"
        ? {
            label: "选项",
            name: `option`,
            type: "array",
            editor: "AArrayGrid",
            arrayMember: valueLabel,
            autoValue: true,
          }
        : null,
      type === "set" || type === "enum"
        ? { label: "其他选项", name: `openOption`, editor: OpenOption }
        : null,
      editor !== "ARate" &&
      editor !== "NPS" &&
      (type === "int" || type === "string" || type === "set")
        ? {
            label:
              type === "set"
                ? "至少选择几项"
                : type === "int"
                ? "可填写的最小值"
                : "最少填写多少字",
            name: "min",
            type: "int",
            max: 100000,
            placeholder: "请填写数字",
          }
        : null,
      editor !== "ARate" &&
      editor !== "NPS" &&
      (type === "int" || type === "string" || type === "set")
        ? {
            label:
              type === "set"
                ? "至多选择几项"
                : type === "int"
                ? "可填写的最大值"
                : "最多填写多少字",
            name: "max",
            type: "int",
            max: 100000,
            placeholder: "请填写数字",
          }
        : null,
      type === "string"
        ? {
            label: "最多展示几行的输入，默认为1",
            name: "stringLines",
            type: "int",
            min: 1,
            max: 100,
            placeholder: "请填写数字",
          }
        : null,
    ];
    if (type === "attachment") {
      base.push({ label: "其他配置", name: `props`, editor: OssuploadProps });
    }
  }

  const itemsSchema = _.compact(base);
  const res = {
    name: `${type}Option`,
    type: "object",
    objectFields: itemsSchema,
  };
  return res;
};
