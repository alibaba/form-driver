import React from "react";
import { Button, Radio } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export type SegmentEditSwitchState = 
  /** 只有一个可以按的【编辑】按钮 */
  "readable" |
  /** 只有一个disable的编辑按钮 */
  "disable" |

  /** 有【取消】和【编辑】按钮，都能按 */
  "editor" |
  /** 有【取消】和【编辑】按钮，但编辑按钮展示为loading且disable */
  "saving"

export interface SegmentEditSwitchProps {
  state: SegmentEditSwitchState
  /** edit=true表示按【提交】或者【编辑】按钮 edit=false表示按了【取消】按钮*/
  onClick: (edit:boolean)=>void
}

/**
 * 展示一个【编辑】按钮，点下以后变成【提交】和【取消】两个按钮
 * @param props 
 */
export function SegmentEditSwitch(props:SegmentEditSwitchProps): JSX.Element{
  let disable = false, saving = false;
  switch(props.state){
    // @ts-ignore
    case "disable":
      disable = true;
    // eslint-disable-next-line no-fallthrough
    case "readable":
      return <Button value="edit" disabled={disable} onClick={()=>props.onClick(true)}>编辑</Button>
    // @ts-ignore
    case "saving":
      saving = true;
    // eslint-disable-next-line no-fallthrough
    case "editor":
      // @ts-ignore
      return <Radio.Group>
        <Radio.Button disabled={saving} value="save" onClick={()=>props.onClick(true)}>{saving?<LoadingOutlined />:undefined} 提交</Radio.Button>
        <Radio.Button key="c" value="cancel" onClick={()=>props.onClick(false)}>取消</Radio.Button>
      </Radio.Group>
  } 
}