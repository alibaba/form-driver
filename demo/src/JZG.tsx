import React from "react";
import { Spin, Modal } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { MFieldSchema } from '../../src/framework/Schema';
import { Ajax } from '../../src/framework/Ajax';
import dd from "dingtalk-jsapi";
import _ from "lodash";
import { MUtil } from '../../src/framework/MUtil';

import { MViewerProp } from "../../src/framework/MViewer";
import { MViewerDebug } from "../../src/framework/MViewerDebug";

type Prop = Omit<MViewerProp, "morph"|"forceValid">;
export class Questionnaire extends React.Component<Prop, any> {
  render() {
    const database = this.props.database || {};
    return <div style={{padding: 15}}>
      <MViewerDebug
        persistant={{localStorageKeyPrefix: "form_"}}
        onSubmit={this.props.onSubmit}
        schema={this.props.schema}
        database={database}
        morph="editor" style={{...this.props.style, maxWidth: 700, margin: "auto"}}>
      </MViewerDebug>
    </div>
  }
}

function ddajax(apiPath:string, body?:any, succMsg:string = "提交完成"):Promise<any> {
  return new Promise<any>(function(resolve, reject){
    const send = (url:string)=>{
      let ajax = body ? Ajax.post(url, body, succMsg) : Ajax.get(url);
      ajax.then(resolve).catch((err) =>{
        reject({errMessage:"服务器忙，请稍后", err});
      })
    }

    if (dd.env.platform === 'notInDingTalk') {
      send(apiPath);
    } else {
      dd.ready(function() {
        dd.runtime.permission.requestAuthCode({
            corpId: "dinga103c1106d97f768",
            // @ts-ignore
            onSuccess: async (result) => send(apiPath + "?authCode=" + result.code),
            onFail: (err) => reject({errMessage:"连接不上钉钉", err})
        });
      });
    }
  });
}

interface State {
  database: any;
}

const agree = [{label: "非常认同", value:"4"}, {label:"比较认同", value: "3"}, {label: "不好说", value: "2"}, {label: "不太认同", value: "1"}, {label: "完全不认同", value: "0"}];
const clazz = [{label:"公司一号位", value:"1"}, {label:"公司高层管理者", value:"2"}, {label:"公司中基层管理者", value:"3"}, {label:"普通员工",value:"3-2"}, {label:"没有人", value:"0"}];
const agree2 = [{label: "完全同意", value:"2"}, {label:"比较同意", value: "1.5"}, {label: "不好说", value: "1"}, {label: "不太同意", value: "0.5"}, {label: "完全不同意", value: "0"}];

export const schema:MFieldSchema[] = [
  { name: "d0", type: "decoration", decoration:{ HTML:"<img src='https://daily-academy.oss-cn-hangzhou.aliyuncs.com/hupanWeb/homepage/img/banner14.jpg?x-oss-process=image/resize,w_640/quality,q_50' style='width:100%'/>" } },
  {
    name: "d1",
    type: "decoration",
    decoration:{
      HTML:`<div class="AWidget_title">价值观践行度测评</div>
        <div style="margin: 0 0 10px 0">亲爱的伙伴：这是一份公司价值观践行度的测评题库，目的是评估公司价值观实际开展的水平和短板所在。</div>
        <div style="margin: 0 0 10px 0">整体问卷包含四部分。第一部分（意识-全局感知）检测的是公司全员对于价值观的意识和感知度，第二部分（行为-胜负手）检测的是价值观在公司的实际践行情况，第三部分（结果-能量球）检测的是因为价值观的践行给组织带来的实际结果和影响。</div>
        <div style="margin: 0 0 10px 0">你的真实反馈对于公司未来更好践行价值观至关重要，期待你的参与！（本测评由湖畔创业研究中心以匿名方式开展，填写约10分钟）</div>`
    }
  },
  {name: "part1", type: "decoration", decoration: { segmentLabel: "【Part 1】意识-全局感知"}},
  {
    name:"t1",
    type: "enum",
    label: "1. 目前公司有成文的价值观吗	？",
    enumFields: [{label: "有", value: "4"}, {label: "没有成文，	但是我认为公司是有一些默认并共同践行的价值观的", value: "2"}, {label: "没有成文的价值观	，并且工作环境中也缺乏一些为大家所默认的价值观", value: "0"}],
  },
  {
    name:"t2",
    type: "enum",
    label: "2. 您认为公司有多少人明确知道公司的价值观",
    enumFields: [{label: "只有公司核心管理者知道", value: "1"}, {label: "公司中基层管理者知道", value: "2"}, {label: "公司绝大多数员工都知道", value: "3"}, {label: "我不确定", value: "0"}],
  },
  {
    name:"t3",
    type: "string",
    label: "3. 请写出公司价值观请写出公司价值观（如果没有成文如果没有成文，请写出你认为公司默认的一些价值观）",
    stringLines: 3,
  },
  {
    name:"t4",
    type: "enum",
    label: "4. 总体上来看，您认同公司的价值观吗？",
    enumFields: agree,
  },
  {
    name:"t51",
    type: "enum",
    label: "5-1. 请选出更符合公司的情况的一个",
    enumFields: [{label: "价值观是管理者也在做的，而不只是要求员工", value: "5"}, {label: "不好说", value: "2"}, {label: "价值观就是管理者操控员工的手段", value: "0"}]
  },
  {
    name:"t52",
    type: "enum",
    label: "5-2. 请选出更符合公司的情况的一个",
    enumFields: [{label: "践行价值观不一定会有现实层面的回报", value: "0"}, {label: "不好说", value: "1"}, {label: "践行价值观对公司和个人发展是真的有效果的", value: "2"}]
  },
  {
    name:"t53",
    type: "enum",
    label: "5-3. 请选出更符合公司的情况的一个",
    enumFields: [{label: "价值观更多是务虚的，落地很难", value: "1"}, {label: "不好说", value: "0"}, {label: "价值观是要落到行动上的", value: "2"}]
  },

  {name: "part2", type: "decoration", decoration: { segmentLabel: "【Part 2】行为-胜负手"}},
  {
    name:"t6",
    type: "set",
    label: "6. 哪些人平时会「提起」公司的价值观？",
    setFields: clazz
  },
  {
    name:"t7",
    type: "set",
    label: "7. 您能切身感受到，哪些人在工作中用行动践行公司的价值观？",
    setFields: clazz
  },
  {
    name:"t8",
    type: "enum",
    label: "8. 请回忆一下，在过去每次公司面临重要选择的时候，最终的决策与价值观相符吗？",
    enumFields: [
      {label: "决策的时候不会考虑价值观的", value: "0-1"},
      {label: "当价值观和当下利益发生冲突的时候，几乎都会选择忽视价值观", value: "0-2"},
      {label: "当价值观和当下利益发生冲突的时候，有时候会选择坚守价值观", value: "2"},
      {label: "当价值观和当下利益发生冲突的时候，几乎都会坚守价值观", value: "3"},
      {label: "对决策过程不清楚", value: "1"}
    ]
  },
  {
    name:"t9",
    type: "enum",
    label: "9. 您有没有观察到或者听说过，部分公司同事的行为或者决策明显违背价值观的情况？",
    enumFields: [
      {label: "有", value: "0"},
      {label: "没有", value: "4"}
    ]
  },
  {
    name:"t10",
    type: "enum",
    label: "10. 管理者有没有在发现的「第一时间」「指出」他的行为是违背价值观的？",
    showIf: "t9=='0'",
    enumFields: [
      {label: "是的，第一时间指出了", value: "2"},
      {label: "指出了，但是是隔了一段时间", value: "1-1"},
      {label: "不，没人指出这件事", value: "0-1"},
      {label: "分情况，有时候有，有时候没有", value: "1-2"},
      {label: "我不清楚", value: "0-2"},
    ]
  },
  {
    name:"t11",
    type: "enum",
    label: "11. 管理者有没有对违背价值观的行为给出各种形式的惩罚？",
    showIf: "t9=='0'",
    enumFields: [
      {label: "有惩罚", value: "2"},
      {label: "没有惩罚", value: "0-1"},
      {label: "分情况，有时候有，有时候没有", value: "1"},
      {label: "我不清楚", value: "0-2"}
    ]
  },
  {
    name:"t12",
    type: "enum",
    label: "12. 管理者有没有在更大的范围内，公开通报这件事？",
    showIf: "t9=='0'",
    enumFields: [
      {label: "有更大范围的通报", value: "2"},
      {label: "没有通报", value: "0-1"},
      {label: "分情况，有时候有，有时候没有", value: "1"},
      {label: "我不清楚", value: "0-2"}
    ]
  },
  {
    name:"t13",
    type: "set",
    label: "13. 【多选】哪些人，参与了公司价值观的生成过程？",
    setFields: [
      {label: "公司一号位", value: "1-1"},
      {label: "人力资源部门或其他主导部门", value: "0-1"},
      {label: "高层团队", value: "1-2"},
      {label: "普通员工", value: "1-3"},
      {label: "不知道", value: "0-2"}
    ]
  },
  {
    name:"t14",
    type: "set",
    label: "14. 【多选】哪些场景中，会提到公司价值观？",
    setFields: [
      {label: "公司墙上，或日常工作环境里的其他物料", value: "0.5-1"},
      {label: "新人入职培训", value: "0.5-2"},
      {label: "各类重要会议上", value: "0.5-3"},
      {label: "团队内部的日常工作中", value: "0.5-4"}
    ]
  },
  {
    name:"t15",
    type: "enum",
    label: "15. 您一般多久能听到有人提及公司价值观？",
    enumFields: [
      {label: "每周", value: "2"},
      {label: "每个月", value: "1.5"},
      {label: "每个季度", value: "1"},
      {label: "超过三个月", value: "0.5"},
      {label: "从未", value: "0"}
    ]
  },
  {
    name:"t16",
    type: "enum",
    label: "16. 我们公司的「奖惩制度」中，有没有和价值观相关的规定？",
    enumFields: [
      {label: "没有", value: "0"},
      {label: "有规定，但是流于形式，没有真正发挥作用", value: "2"},
      {label: "有规定，并且是落实的", value: "3"},
      {label: "不知道", value: "1"}
    ]
  },
  {
    name:"t17",
    type: "enum",
    label: "17. 我们公司的「晋升选拔制度」中，有没有和价值观相关的规定？",
    enumFields: [
      {label: "没有", value: "0"},
      {label: "有规定，但是流于形式，没有真正发挥作用", value: "2"},
      {label: "有规定，并且是落实的", value: "4"},
      {label: "不知道", value: "1"}
    ]
  },
  {
    name:"t18",
    type: "enum",
    label: "18. 我们公司的「绩效体系」中，有没有和价值观相关的规定？",
    enumFields: [
      {label: "没有", value: "0"},
      {label: "有规定，但是流于形式，没有真正发挥作用", value: "2"},
      {label: "有规定，并且是落实的", value: "4"},
      {label: "不知道", value: "1"}
    ]
  },
  {
    name:"t19",
    type: "enum",
    label: "19. 我们公司的「招聘和辞退制度」中，有没有和价值观相关的规定？",
    enumFields: [
      {label: "没有", value: "0"},
      {label: "有规定，但是流于形式，没有真正发挥作用", value: "2"},
      {label: "有规定，并且是落实的", value: "3"},
      {label: "不知道", value: "1"}
    ]
  },
  {
    name:"t20",
    type: "enum",
    label: "20. 您能明确的知道，我们公司哪个部门负责价值观的运营吗？",
    enumFields: [
      {label: "我不清楚", value: "1"},
      {label: "公司没有任何人或部门是负责运营价值观的", value: "0"}
    ],
    openOption: {label:"是的，我知道，部门名字是", type:"string"}
  },
  {
    name:"t21",
    type: "set",
    label: "21. 对价值观的实践情况有一些看法的时候，公司员工有哪些向上反馈的通道？",
    setFields: [
      {label: "没有", value: "0"},
      {label: "没有形成机制，但是可以向上级管理者一对一沟通", value: "3-1"},
      {label: "员工内部社群", value: "3-2"},
      {label: "反馈邮箱", value: "3-3"},
      {label: "开放日", value: "3-4"},
    ],
    openOption: {label:"其他", type:"string"}
  },
  {
    name:"t22",
    type: "enum",
    label: "22. 【多选】我们公司的价值观里，是否包含做业务的行为指导？",
    enumFields: [
      {label: "有", value: "3"},
      {label: "没有", value: "0"},
      {label: "不知道", value: "1"}
    ],
  },
  {
    name:"t23",
    type: "enum",
    label: "23. 在业务讨论的过程中，会提及价值观吗？",
    enumFields: [
      {label: "经常会提及", value: "3"},
      {label: "业务是很务实的，很难和价值观直接建立关联，所以不太会提及", value: "0"},
      {label: "价值观已经内化到我们每个人的行为里，不需要刻意提及", value: "2"}
    ],
  },
  {
    name:"t24",
    type: "enum",
    label: "24. 如果价值观和业务结果发生了冲突，一般会怎样处理？",
    enumFields: [
      {label: "业务优先，活下去才能有价值观，所以为了业务作出违背价值观的行为是有的", value: "0"},
      {label: "业务为价值观让路，无论如何不能违背价值观", value: "3"},
      {label: "具体情况具体分析，权衡出最好的结果", value: "1"}
    ],
  },

  {name: "part3", type: "decoration", decoration: { segmentLabel: "【Part 3】结果-能量球"}},
  {
    name:"t25",
    type: "enum",
    label: "25. 您个人在工作中，有没有从公司的价值观中，得到明确的行为指导？",
    enumFields: [
      {label: "有", value: "2"},
      {label: "没有", value: "0"}
    ],
  },
  {
    name:"t26",
    type: "enum",
    label: "26. 您的团队，是否曾经在面临高度不确定的情况时，在价值观的指引下做出共同的选择？",
    enumFields: [
      {label: "有过", value: "0-1"},
      {label: "没有在价值观引导下做过选择", value: "0-2"},
      {label: "没面临过这种高度不确定的情况", value: "2"}
    ],
  },
  {
    name:"t27",
    type: "enum",
    label: "27. 那次选择，有没有为公司带来好的结果？",
    showIf: "t26=='0-1'",
    enumFields: [
      {label: "不，结果不太理想", value: "0"},
      {label: "是的，结果很好", value: "4"},
      {label: "不好说", value: "1"}
    ],
  },
  {
    name:"t28",
    type: "enum",
    label: "28. 公司是否经历过关乎生死的重大抉择？",
    enumFields: [
      {label: "是的，经历过", value: "0"},
      {label: "不，没经历过", value: "3-1"},
      {label: "不知道", value: "3-2"}
    ],
  },
  {
    name:"t29",
    type: "enum",
    label: "29. 当时做出的决策，是遵从还是违背了价值观？",
    showIf: "t28=='0'",
    enumFields: [
      {label: "遵从了价值观", value: "0"},
      {label: "违背了价值观", value: "2"},
      {label: "和价值观没什么关系", value: "1"}
    ],
  },
  {
    name:"t30",
    type: "enum",
    label: "30. 现在看来，当时的决策，有没有给公司带来好的结果？",
    showIf: "t28=='0'",
    enumFields: [
      {label: "不，结果不太理想", value: "0"},
      {label: "是的，结果很好", value: "4"},
      {label: "不好说", value: "1"}
    ],
  },
  {name:"t31", type:"enum", label:"31. 因为公司价值观的践行，我们拥有了区别于其它组织的鲜明特征", enumFields: agree2},
  {name:"t32", type:"enum", label:"32. 因为公司价值观的指导，我们在工作中原则上的分歧更少", enumFields:agree2},
  {name:"t33", type:"enum", label:"33. 因为价值观，我们更明确知道我们需要什么样的同伴", enumFields:agree2},
  {name:"t34", type:"enum", label:"34. 更多的人因为我们的价值观而长期留在公司", enumFields:agree2},
  {name:"t35", type:"enum", label:"35. 因为公司的价值观，我会觉得我的工作是更加有价值和有意义的", enumFields:agree2},
  {name:"t36", type:"enum", label:"36. 因为公司的价值观，我愿意更长久的投入到这份工作中", enumFields:agree2},
  {name:"t37", type:"enum", label:"37. 在价值观的影响下，我学会了一些重要的技能", enumFields:agree2},
  {name:"t38", type:"enum", label:"38. 在价值观的影响下，我现在的一些行为方式，和从前有了改变", enumFields:agree2},
  {name:"t39", type:"enum", label:"39. 在价值观的影响下，我的认知比从前有拓展", enumFields:agree2},

  {name:"part4",type: "decoration", decoration: { segmentLabel: "【Part 4】背景资料"}},
  {name:"b1", type:"enum", label:"B1. 您的性别", enumFields:"男 女"},
  {name:"b2", type:"enum", label:"B2. 您的出生年代", enumFields:"95(含)后 90(含)后 85(含)后 80(含)后 70(含)后 60(含)后 60年前"},
  {name:"b3", type:"enum", label:"B3. 您的司龄", enumFields:"1年以内 1-2年(含) 2-3年(含) 3-5年(含) 5年以上 10年以上"},
  {name:"b4", type:"enum", label:"B4. 您在组织中的角色", enumFields:"公司一号位 公司高层管理者 公司中基层管理者 普通员工"},
  {name:"b5", type:"string", label:"B5. 您所属的部门是"},
  {name:"b6", type:"enum", label:"B6. 分类的话，您的部门属于", enumFields:"业务部门 创新业务部门 研发部门 职能部门"},
  {name:"b7", type:"enum", label:"B7. 在您看来，公司是属于以下哪种驱动形式？", enumFields:"产品驱动 创新驱动 销售驱动 流程驱动", openOption:{label: "其他", type:"string"}},

  {name:"d3", type: "decoration", decoration:{ HTML:'<div style="text-align:center;margin: 20px 0 15px 0;font-size:14px;border-top: var(--MViewerBorder);padding: 20px;">感谢你的耐心填写，公司文化价值观的落地将因你而不同！</div>'}},
  {name:"d2", type: "decoration", decoration:{ submitLabel:"提交" } },
  {name:"d4", type: "decoration", decoration:{ HTML:'<div style="margin:0 0 10px 0; font-size: 10px; text-align:center">Powered by 湖畔技术团队</div>'}},
];

export class JZG extends React.Component<any, State> {
  authCode:string;

  constructor(p: any){
    super(p);
    this.state = {database:null};

    const n2s = _.keyBy(schema, "name");

    schema.forEach(e=>{
      if(e.type=="enum"){
        e.editor = "ARadio"
      }
      e.required=true;
      if(e.name !== "t1" && e.type !== "decoration"){
        e.showIf = (e.showIf ? "(" + e.showIf + ") && " : "") + "(t1 != '0')"
      }
    })

    function handelDep(partSchema, names){
      let conds = _.uniq(names.map(e=>n2s[e].showIf));
      partSchema.showIf = _.join( _.compact(conds).map(e=>"(" + e + ")"), " || ");
    }
    
    handelDep(n2s["part1"], ["t1", "t2", "t3", "t4", "t51", "t52", "t53"])
    handelDep(n2s["part2"], _.range(6, 24+1).map(e=>"t"+e))
    handelDep(n2s["part3"], _.range(25,39+1).map(e=>"t"+e))
    handelDep(n2s["part4"], _.range(1, 7+1).map(e=>"b"+e))
  }

  componentDidMount(){
    // ddajax("/fan/load").then(resp=>{
    //   ddajax("/fan/login").then(userinfo=>{
    //    this.setState({database: resp});
    //   }).catch((e)=>{
    //     this.setState({database: {}});
    //     // alert("请用手机钉钉打开")
    //   })
    // }).catch(e=>{
    //   this.setState({database: {}});
    //   alert(e.errMessage);
    // });
    this.setState({database: {}});
  }

  render() {
    let s:MFieldSchema = {
      name:"quest",
      type:"object",
      objectFields:schema,
      uispec: {
        type: "flowForm",
        layout: "vertical"
      }
    };
    const verr = MUtil.validateSchema(s);
    if(verr.length > 0){
      console.log(verr);
    }
    return this.state.database
      ? <Questionnaire
          schema={s}
          database={this.state.database}
          onSubmit={ async (finalData:any) => {
            const e = await ddajax("/fan/save", finalData, "");
            Modal.success({
              title: '提交完成',
              okText: '确认'
            });
          }}/>
      : <Spin indicator={<LoadingOutlined style={{ fontSize: 48, position:"absolute", left:"calc(50% - 24px)", top:"calc(50% - 24px)"}} spin />} />
  }
}
