import React from "react";
import _ from "lodash";
import { Ajax, Viewer } from "form-driver";
import { Upload, message, Button } from 'antd';
const OSS = require('ali-oss');

class OssUpload extends Viewer {
  constructor(p) {
    super(p);
    const prevData = super.getValue();
    this.state = {
      checkpoint: null,
      progress: 0,
      fileList: prevData.map((item, index) => {
        item.uid = index
        return item
      })
    }
    this.options = Object.assign({
      changeHandle: () => { },
      resFormat: res => res,
      srcFormat: src => src
    }, this.props.schema.options)
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

  cancleUpload = () => {
    if (this._client) this._client.cancel();
    this.setState({ loading: true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options && _.isBoolean(nextProps.options.show) && !nextProps.options.show) {
      // 隐藏的时候取消上传
      this.cancleUpload();
    }
  }

  componentWillUnmount() {
    window.clearInterval(this._timer);
    // 关闭页面的时候取消上传
    this.cancleUpload();
  }

  conRemove = (file) => {
    console.log(file)
    const list = super.getValue()?.filter(i => file.uid !== i.uid)
    // this.setState({
    //   fileList: list
    // })
    super.changeValue(list)
  }

  // 自定义上传操作
  customRequest = async ({ file }) => {
    console.log('customRequest: ', file)

    this.loading = undefined;
    const { keyPath } = this.options
    const name = `${keyPath}/${new Date().getTime()}-${file.name}`;
    console.log('filename：', name)

    // 上传文件
    this._client.multipartUpload(name, file,
      {
        progress: this.progressFun,
        timeout: 3000,
        checkpoint: this.state.checkpoint,
        meta: { 'permission-ext-or': 'm3PluginOssUpload' }
      }
    ).then((res) => {
      let fileList = super.getValue()
      fileList.push({
        name: file.name,
        osskey: name
      })
      super.changeValue(fileList);
      this.reset();
    }).catch(e => {
      console.log(e);
      this.reset();
    });
  }

  beforeUpload = (file) => {
    const { maxSize } = this.options
    if (file.size > maxSize * 1024 * 1024) {
      message.error(`文件大小超过${maxSize}MB，请压缩后上传`);
      return false
    }
  }

  element() {
    const p = this.props.schema.props ?? {};
    const uploadProps = {
      onRemove: this.onRemove,
      customRequest: this.customRequest,
      beforeUpload: this.beforeUpload,
      // 回填初始值
      // fileList: this.state.fileList
      fileList: super.getValue()?.map((item, index) => {
        if (!item.uid) item.uid = index
        return item
      })
    };

    return (
      <Upload disabled={this.loading !== undefined} {...uploadProps} {...p}>
        <Button disabled={this.loading !== undefined}>点击上传</Button>
      </Upload>
    )
  }
}

export default OssUpload
