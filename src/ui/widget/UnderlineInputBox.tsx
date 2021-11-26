import React from "react";
import { InputHTMLAttributes } from "react";
import { assembly } from "../../framework/Assembly";
import "./UnderlineInputBox.less";

export class UnderlineInputBox extends React.Component<InputHTMLAttributes<HTMLInputElement>, any> {
  render(){
    return <input className={assembly.theme.themeName + "InputBox"} {...this.props}></input> 
  }
}
