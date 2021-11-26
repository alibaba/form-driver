import React from "react";
import _ from "lodash";
import { BaseViewer } from "../../BaseViewer";
import { Upload, message, Button } from 'antd';
import { MUtil } from "../../..";

/**
 * antd 的上传组件 https://ant.design/components/upload-cn/
 *  {
      "type": "array", arrayMember: {
        type: 'object',
        readable: 'A',
        style: {display: 'block'},
        a: {
          urlExpr: "value.url",
          labelExpr: "value.name",
        },
      },
      "editor": "AUpload", "name": "upload_sec", "label": "文件上传_HP_SECOBJ",
      ossFile: {
        type: "HP_SECOBJ",
        arguments: { genName: true, ossKeyPath: "course/" }
      }, props: {
        beforeUpload(file) {
          const isLt200M = file.size / 1024 / 1024 < 200;
          if (!isLt200M) {
            message.error('File must smaller than 200MB!');
          }
          return isLt200M;
        },
      }
    }
 */
export class AUpload extends BaseViewer {
  loading?: number = undefined;

  element() {
    const p = this.props.schema.props ?? {};
    const { type } = this.props.schema.ossFile
    let a = {
      name: "file",
      data: (file: any) => (this.props.schema.ossFile?.arguments),
    }
    if (type === 'HP_GO') {
      Object.assign(a, {
        action: "/academy/go/upload",
      })
    } else if (type === 'HP_SECOBJ') {
      Object.assign(a, {
        action: "/academy/oss/secObject",
      })
    } else {
      return MUtil.error(`ossFile.type=${type}无效`, this.props.schema)
    }

    const prevData = super.getValue();
    if (prevData) {
      Object.assign(a, {
        defaultFileList: prevData.map((item, index) => {
          item.uid = index
          return item
        })
      })
    }

    const props = {
      ...a,
      onChange: info => {
        if (p.onChange) p.onChange(info)
        console.log(info)
        const { file, fileList = [] } = info

        switch (file.status) {
          case 'uploading':
            this.loading = Math.floor(file.percent || 0);
            this.setState({});
            break;
          case "done":
          case 'success':
            this.loading = undefined;
            if (type === 'HP_GO') {
              fileList[fileList.length - 1] = {
                name: file.name,
                url: file.response.content.url
              }
              super.changeValue(fileList);
            } else if (type === 'HP_SECOBJ') {
              const newValue = `/academy/oss/secObject/${file.response.data?.ossKey}`;
              if (file.response.errorCode) {
                message.error(file.response.message);
              } else {
                fileList[fileList.length - 1] = {
                  name: file.name,
                  url: newValue
                }
                super.changeValue(fileList);
              }
            }
            break;
          case 'error':
            this.loading = undefined;
            this.setState({});
            message.error("上传失败了");
            break;
          case 'removed':
            super.changeValue(fileList);
            break;
        }
      },
      ...p,
    }
    return (
      <Upload key={this.props.path}
        disabled={this.loading !== undefined} {...props}>
        <Button disabled={this.loading !== undefined}>点击上传</Button>
      </Upload>
    )
  }
}