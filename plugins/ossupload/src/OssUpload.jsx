/* eslint-disable */
import React from "react";
import { Upload, message, Button } from 'antd';
import { Ajax, Viewer } from "form-driver";
import _ from "lodash";

const OSS = require('ali-oss');

class OssUpload extends Viewer {
  constructor(p) {
    super(p);
    this.state = {
      checkpoint: null,
      progress: 0,
      fileList: (super.getValue() || []).map((item, index) => {
        if (!item.uid) item.uid = index
        return item
      })
    }
    this.options = Object.assign({
      changeHandle: () => { },
      resFormat: res => res,
      srcFormat: src => src,
    }, p.schema.props)
  }

  changeFileList = (list) => {
    this.setState({
      fileList: list
    })
    super.changeValue(list) 
  }  

  reset = () => {
    this.setState({ isUploading: false, loading: false });
  }

  progressFun = (p, checkpoint) => {
    this.setState({
      progress: `${Math.floor(p * 100)}%`,
      checkpoint
    });
    return function (done) {
      done();
    };
  }
  componentDidMount() {
    const { getTokenUrl, keyPath } = this.options
    if (getTokenUrl) {
      const createOss = () => {
        Ajax.get(getTokenUrl, { keyPath }).then(res => {
          const data = res.data
          this.OSSData = data
          this._client = new OSS({
            ...data,
            stsToken: data.securityToken
          })
        })
      };
      createOss();
      // 保持 oss 连接
      this._timer = window.setInterval(createOss, 55 * 60 * 1000);
    }
  }

  cancleUpload = () => {
    if (this._client) this._client.cancel();
    this.setState({ loading: true });
  }

  componentWillUnmount() {
    window.clearInterval(this._timer);
    // 关闭页面的时候取消上传
    this.cancleUpload();
  }

  onRemove = (file) => {
    console.log('onRemove: ', file)
    console.log('this.state.fileList: ', this.state.fileList)
    const list = this.state.fileList?.filter(i => file.uid !== i.uid)
    console.log(list)
    this.changeFileList(list)
  }

  // 自定义上传操作
  customRequest = async ({ file }) => {
    console.log('customRequest: ', file)
    this.loading = undefined;
    const { keyPath } = this.options
    const name = `${keyPath}/${new Date().getTime()}-${file.name}`;

    // 上传文件
    this._client.multipartUpload(name, file,
      {
        progress: this.progressFun,
        timeout: 3000,
        checkpoint: this.state.checkpoint,
        meta: { 'permission-ext-or': 'm3PluginOssUpload' }
      }
    ).then((res) => {
      console.log('multipartUpload: ', res)
      let fileList = this.state.fileList
      fileList.push({
        uid: file.uid,
        name: file.name,
        osskey: name
      })
      this.changeFileList(fileList);
      this.reset();
    }).catch(e => {
      console.log('multipartUpload-error: ', e);
      this.reset();
    });
  }

  beforeUpload = (file) => {
    const { maxSize, maxAmount } = this.options
    console.log(this.state.fileList)
    // + 1 是为了排除当前文件
    if (this.state.fileList.length >= maxAmount) {
      message.error(`已达到文件数量上限(${maxAmount}个)，请删除后上传`);
      return false
    }
    if (file.size > maxSize * 1024 * 1024) {
      message.error(`文件大小超过${maxSize}MB，请压缩后上传`);
      return false
    }
  }

  element() {
    const list  = super.getValue()
    const uploadProps = {
      onRemove: this.onRemove,
      customRequest: this.customRequest,
      beforeUpload: this.beforeUpload,
    };

    return (
      <Upload disabled={this.loading !== undefined} {...uploadProps} fileList={list}>
        <Button disabled={this.loading !== undefined}>点击上传</Button>
      </Upload>
    )
  }
}

export default OssUpload
