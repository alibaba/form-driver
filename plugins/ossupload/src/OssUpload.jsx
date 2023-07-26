/* eslint-disable */
import React from "react";
import OSS from 'ali-oss';
import { Upload, message, Button } from 'antd';
import { Ajax, Viewer } from "form-driver";

// const OSS = require("ali-oss")


class OssUpload extends Viewer {
  constructor(p) {
    super(p);
    this.state = {
      loading: false,
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
    const list = this.state.fileList?.filter(i => file.uid !== i.uid)
    this.changeFileList(list)
  }

  // 自定义上传操作
  customRequest = async ({ file }) => {
    console.log('customRequest: ', file)
    this.loading = undefined;
    const { keyPath } = this.options
    const name = `${keyPath}/${new Date().getTime()}-${file.name}`;

    this.setState({ loading: true });
    // 上传文件
    try {
      // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
      // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
      // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
      const res = await this._client.put(
        name,
        file
      );
      console.log('client.put: ', res)
      let fileList = this.state.fileList
      fileList.push({
        uid: file.uid,
        name: file.name,
        osskey: name
      })
      this.changeFileList(fileList);
      this.setState({ loading: false });
    } catch (e) {
      console.log('client.put-error: ', e);
      this.setState({ loading: false });
    }
  }

  beforeUpload = (file) => {
    const { maxSize, maxAmount } = this.options
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
    const list = super.getValue()
    const {loading} = this.state
    const uploadProps = {
      onRemove: this.onRemove,
      customRequest: this.customRequest,
      beforeUpload: this.beforeUpload,
    };

    return (
      <Upload disabled={loading} {...uploadProps} fileList={list}>
        <Button disabled={loading} loading={loading}>点击上传</Button>
      </Upload>
    )
  }
}

export default OssUpload
