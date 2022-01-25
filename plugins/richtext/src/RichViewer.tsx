import React from "react";
import { BaseViewer } from 'form-driver';

export class RichViewer extends BaseViewer {
  element() {
    return <div className={'ql-editor'} style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: this.getValue() }} />
  }
}
