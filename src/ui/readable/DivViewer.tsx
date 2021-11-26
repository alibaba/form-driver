import React from "react";
import { BaseViewer } from '../BaseViewer';
import { assembly } from '../../framework/Assembly';

export class DivViewer extends BaseViewer {
  element() {
    return <pre style={{marginBottom:0, color: "rgba(0,0,0,0.6)", overflow: "initial", wordBreak: "break-all", whiteSpace: "pre-wrap", ...this.props.schema.style}}>
      {assembly.toReadable(this.props.schema, super.getValue(), super.getParentValue())}
    </pre>
  }
}
