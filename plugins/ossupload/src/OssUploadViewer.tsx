import React from "react";
import { BaseViewer } from 'form-driver';

class OssUploadViewer extends BaseViewer {
  element() {
    return <div dangerouslySetInnerHTML={{ __html: this.getValue() }} />
  }
}

export default OssUploadViewer
