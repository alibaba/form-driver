import React from "react";
import { BaseViewer } from 'form-driver';

class OssUploadViewer extends BaseViewer {
  element() {
    const arr = this.getValue() || []
    return <div>
      {
        arr.map(i => {
          return <div key={i.uid}><a target='_blank' href={i.url}>{i.name}</a></div>
        })
      }
    </div>
  }
}

export default OssUploadViewer
