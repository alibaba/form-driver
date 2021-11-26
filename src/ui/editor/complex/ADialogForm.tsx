
import React from "react";
import { BaseViewer } from "../../BaseViewer";
import { MUtil } from "../../../framework/MUtil";
import { assembly } from '../../../framework/Assembly';
import { Button, Modal } from "antd";
import { AForm } from "./AForm";

/**
 * 展示为一个按钮，点击后弹出对话框编辑
 */
export class ADialogForm extends BaseViewer {
  pop:boolean;

  constructor(p){
    super(p);
    this.close = this.close.bind(this);
  }

  close(){
    this.pop = false;
    this.setState({})
  }

  element() {
    const value = super.getValue();
    const readable = assembly.toReadable(this.props.schema, value, super.getParentValue());
    return <>
      <Modal
        style={this.props.style}
        closable={false}
        keyboard={true}
        width="70%"
        className={MUtil.phoneLike() ? "MEditor_p" : "MEditor"} maskClosable={false} title="编辑" visible={this.pop} 
        footer={<Button onClick={this.close}>确定</Button>}>
        <AForm {...this.props}/>
      </Modal>
      {readable}
      <Button style={{marginLeft: 15}} onClick={()=>{
        this.pop = true;
        this.setState({});
      }}>编辑</Button>
    </>
  }
}
