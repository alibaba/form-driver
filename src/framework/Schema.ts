import { MORPH, VIEWER, Assembly } from './Assembly';

export type ValueConst = string | boolean | number;
export interface MEnumField {
  // 展示选项时，html > label > value

  /** 选项文案 */
  label?: string,
  /** 选项html */
  html?: string,
  /** 选项的showIf */
  showIf?: boolean,
  /** 选项html */
  value: ValueConst,
  // 排他选项。
  // 只对多选有效，exclusive不同（exclusive都是undefined的两个选项，也算相同）的两个选项，不能同时选中
  // 应用场景：有些多选中有 "以上都没有" 这类选项，选中时，其他选项都要取消掉
  exclusive?: string,
  // 选项分值
  score?: number,

  children?: MEnumField[];
}

/** 匿名的MFieldSchema，没有name字段 */
export type MFieldSchemaAnonymity = Omit<MFieldSchema, "name">

/** JS表达式 */
export type JSEXPR = string;

/** 如何适配屏幕 */
export type SCREEN_ADAPTION =
  /** 强制使用适应大屏的控件 */
  "big" |
  /** 强制使用适应小屏的控件 */
  "phone"

/** M3 单元的 schema */
export interface MFieldSchema {
  type?: string,
  name: string,
  label?: string,

  /** 编辑器，editor:<viewer名字> 是 viewerFor: {morph:"editor", name:<viewer名字>} 的简写 */
  editor?: string | VIEWER,

  /** 查看器，readable:<viewer名字> 是 viewerFor: {morph:"readable", name:<viewer名字>} 的简写 */
  readable?: string | VIEWER,

  /** 选项 */
  option?: MEnumField[] | string;

  /** @deprecated 旧版本字段，新版本用 options */
  enumFields?: string | MEnumField[];

  /** @deprecated 旧版本字段，新版本用 options */
  setFields?: string | MEnumField[];

  /** 如果选项是不完全的，要设置这个值，允许用户自己输入 */
  openOption?: MFieldSchemaAnonymity;

  /** @deprecated 旧版本字段，新版本用 openOption */
  enumOpen?: MFieldSchemaAnonymity;

  /** @deprecated 旧版本字段，新版本用 openOption */
  setOpen?: MFieldSchemaAnonymity;

  /** 
   * 默认值 
   * object上设置defaultValue后，其字段的defaultValue就无效了
   */
  defaultValue?: ValueConst,

  /** 
   * 表单控件的属性（对应 antd 组件的 api）
   */
  props?: any,

  /** 最多输入多少行，默认1，表示单行字符串 */
  stringLines?: number;

  /** 最小值/最小长度/至少选几项 (include) */
  min?: number;

  /** 最大值/最大长度/最多选几项 (include) */
  max?: number;

  /** 是否是必选项 */
  required?: boolean;

  /** 当表达式成立时认为表单中有这个字段，不成立时字段不展示，也不会输出数据 */
  showIf?: JSEXPR;

  /** 分栏数 */
  column?: number;

  /** 展示前格式化值。
   * string=js模板字符串，可用变量包括:
   *    value是数据值
   *    _ 是lodash
   *    readable是原来默认的toReadable函数转换后的字符串
   *    READABLE_UNKNOWN/READABLE_BLANK/READABLE_INVALID/READABLE_ERROR：这些值参考MTheme
   * 函数=就不用解释了，自己可以随意发挥了
   */
  toReadable?: string | ((v: any, parent: any, assembly: Assembly) => string),

  /** 
   * true表示值不是严格匹配
   * 例如枚举的value是number时，传入字符串也可以匹配
   */
  tolerate?: boolean;

  /** 是否强制使用大屏或者小屏的控件，默认是自动 */
  screenAdaption?: SCREEN_ADAPTION

  /** 展示时显示的后缀 */
  postfix?: string,

  /** 会展示为一个问号图标，点击弹出提示 */
  popoverDesc?: React.ReactNode;

  /** undefined表示 这个字段不是必填的，否则表示此字段不填时的提示信息*/
  requiredMessage?: string;

  /** 有的字段是多个框，可能需要多个placeholder */
  placeholder?: string | string[];

  objectFields?: MFieldSchema[];
  /** 对象类型中，哪些字段作为标题展示成readable，默认是第一个字段 */
  objectLabelFields?: string[];

  /** 字符串是不是允许全部填空格/t/n，默认不允许 */
  stringAllowSpaceOnly?: boolean;

  /** 矩阵类型的配置 */
  matrix?: {
    /** 矩阵的横轴选项 */
    x: string | MEnumField[];

    /** 矩阵的纵轴选项 */
    y: string | MEnumField[];

    /** 每行最多选几个，默认1 */
    maxX?: number,

    /** 每行最少选几个，默认1 */
    minX?: number,

    /** 每列最多选几个，默认无限多个 */
    maxY?: number,

    /** 每列最少选几个，默认1 */
    minY?: number,

    /** 开放项的配置，开放项是y轴最后一个选项 */
    open?: {
      label: string
    }
  };

  /** 数组成员类型 */
  arrayMember?: MFieldSchemaAnonymity;
  
  /** 数组增加一项的按钮文案 */
  arrayAddLabel?: string;

  /** experience类型配置 */
  experience?: {
    /** 除了起始时间，至今选项外，还要有什么字段 */
    members: MFieldSchema[];
    /** 允许时间段重叠，默认是不能重叠 */
    overlap?: boolean;
  };

  /** dateRange 类型配置 */
  dateRange?: {
    /** 是否隐藏至今按钮 */
    hideTillNow?: boolean;
    /** 是否能选择时间 */
    showTime?: boolean;
  }

  /** 数据格式 */
  dataFormat?:
  "x" | "YYYYMMDD" | /** 用于时间日期类型字段的数据格式，参考moment，例如x表示数据是时间戳，YYYYMMDD表示数据是形如19990130的字符串 */
  string;

  /**
   * 例如：
   * 4.5 与去年同期(2019 年 1 月初-6 月底)相比，您的收入
   * (1)增长了约___万元 (2)下降了约___万元 (3)基本没有变化
   */
  intDiff?: {
    incLabel: string;         // 增长了约
    incLabelPostfix: string; // 万元
    decLabel: string;         // 下降了约
    decLabelPostfix: string; // 万元
    keep: string;             // 基本没有变化
  };

  /** 可以自己写个样式，会作用于antd元素上 */
  css?: any;

  /** 删除这个字段数据时的提示，不写会直接删除，不提示 */
  removeConfirm?: string;

  /**
   * most case size 字段通常有多少个字符(string)/项(array)，或者用css写长度
   * 布局器会尽量让小于mcs的值可以不需要滚动就展示出来
   * string/ 最好配上
   * 不完全enum/不完全set，可以配，默认是最长的候选值的字符数
   * 完全enum/完全set，不用配
   */
  mcs?: number | string;

  /** ui规约 */
  uispec?: M3UISpec;

  /** 用于hpOrg类型*/
  hpOrg?: {
    /** 空格表示根 */
    rootId: string
  };

  ossFile?: {
    type: "HP_GO" | "HP_SECOBJ",
    /** 预览大小，单位像素 */
    previewSize?: number,
    arguments:
    { genName: boolean, ossKeyPath: string, permissionPolicyOr: string }  // HPHOM_SECOBJ的参数，也就是/academy/oss/secObject的参数
    | { appName: string } // HPHOM_GO的参数，也就是/academy/go/upload的参数
    | any;
  }

  /** 装饰物的html */
  decoration?: {
    subType?: "rich" | "segmentLabel" | "submitBar" | "operations", // 子类型
    HTML?: string, // html片段
    submitLabel?: string, // 提交按钮
    segmentLabel?: string, // 分段标题
    operations?: { label: React.ReactNode, handler: (data) => void }[]  // 操作
  }

  /** 
   * 来自远程的数据，用于下拉搜索框.
   * 例如对于如下远程数据
   * {
        "data": {
            "pagination": {
                ...
            },
            "list": [
                { "id": 33219, "name": "张媛", "brief": "掌阅科技股份有限公司" },
                { "id": 86576, "name": "张步镇", "brief": "广州速道信息科技有限公司" }
            ]
        }
    }
    remote配置示例：
      remote:{
        url: ... ,
        dataPath: "data.list",
        valuePath: "id",
        labelExpr: "name + '(' + brief + ')'"
      }
   */
  remote?: {
    /** 数据url，可以用${q}引用用户输入的查询关键字 */
    url: string,
    /** url返回的json中，数据list的路径 */
    dataPath: string,

    /** 在dataPath下，值字段路径 */
    valuePath: JSEXPR,

    /** 在dataPath下，标题字段的表达式 */
    labelExpr: JSEXPR,
  }

  a?: {
    urlExpr?: ((value: any, parent: any) => React.ReactNode) | JSEXPR;
    labelExpr?: ((value: any, parent: any) => React.ReactNode) | JSEXPR;
    onClick?: (value: any, parent: any) => void;
    /** 在当前页面打开 */
    currentPage?: boolean;
  }

  /** 元素的style */
  style?: React.CSSProperties

  /** 布局方式，垂直（vertical）、水平（horizontal） */
  layoutHint?: "v" | "h";

  /** 其他插件的配置 */
  options?: any;
  
  /** 业务数据 */
  bizData?: any;
}

/** 
 * 数据变化时回调
 * final=true表示回调是因为类似失去焦点导致的，此后不会再有变化回调
 * final=false表示回调是因为用户操作导致的，不处理的话也不会导致最终数据不一致，因为后续会有final=true的回调。
 * 对于暂存表单等比较重的操作，应该仅在final=true时触发，以减少调用次数
 */
export type AFTER_CHANGE_CALLBACK = (path: string, v: any, final: boolean) => void;

export interface MProp {
  /** database的数据描述 */
  schema: MFieldSchemaAnonymity,

  /** json格式数据 */
  database: any,

  /** 编辑database中的字段路径 */
  path: string,

  /** 元素形态 */
  morph: MORPH;

  /** database有任何变化时回调 */
  afterChange?: AFTER_CHANGE_CALLBACK,

  /** @deprecated 直接上层。有时parent是谁，会影响渲染字段 */
  parent?: MFieldSchemaAnonymity,

  /** 强制展示校验信息 */
  forceValid?: boolean,

  /**
   * 要求元素展示删除按钮 
   * true=父元素是array(或object），要求子元素展示删除按钮
   * false=父元素是array(或object），子元素可以展示删除按钮，但disable
   * undefined=子元素不能展示删除按钮
   */
  removeButton?: boolean,

  /** 禁用元素 */
  disable?: boolean,

  /** 是否隐藏边框，例如在表格中就不需要边框 */
  hideBorder?: boolean,

  /** 额外的控件，比如AArrayGrid里加个按钮 */
  extra?: JSX.Element;

  // 以下都是向下传递到html元素的
  style?: React.CSSProperties,
  className?: string
}
export interface M3UISpecSegmentItem {
  label: string,
  fields: string[],
  showIf?: string,
  name?: string,

  /** 如果要支持分段编辑提交，要设置此回调 */
  onSubmit?: (segment: M3UISpecSegmentItem, segmentData: any, done: () => void) => void;

  /** 设置分段根元素的style */
  style?: React.CSSProperties,
}

export interface M3UISpec {
  type: "segmentForm" | "stepForm" | "flowForm",
  layout: "horizontal" | "vertical",
  comma?: string,
  labelAlign?: "left" | "right"
  segments?: M3UISpecSegmentItem[];
}

export interface MValidationFail {
  /** 错误信息，空字符串表示因为子元素错误导致的，因为子元素已经展示错误了，父元素就不需要再展示了 */
  message: string;

  /** 数据的路径 */
  path: string;
}

/**
 * 校验结果
 * MValidationFail: 校验直接失败，不再经过下一个校验器
 * pass: 直接通过校验，不再经过下一个校验器了（例如 required=false时，数值是nil, 可以直接pass，否则之后的校验器都要处理nil）
 * undefined: 表示让下一个校验器再校验
 */
export type MValidationResult = MValidationFail | "pass" | undefined;
