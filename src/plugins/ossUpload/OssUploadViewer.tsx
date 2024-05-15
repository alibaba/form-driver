import React from "react";
import { BaseViewer } from "../../index";

// 字节友好展示
export function bytesToSize(bytes, fixNum = 1) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (sizes[i]) {
    return (bytes / Math.pow(1024, i)).toFixed(fixNum) + ' ' + sizes[i];
  } else {
    return ''
  }
}

class OssUploadViewer extends BaseViewer {
  [x: string]: any;
  element() {
    const arr = this.getValue() || []
    return <div>
      {
        arr.map(i => {
          return <div key={i.uid}><a target='_blank' href={i.url}>{i.name}</a>  {i.size ? <span> {bytesToSize(i.size)}</span> : ""} </div>
        })
      }
    </div>
  }
}

export default OssUploadViewer
