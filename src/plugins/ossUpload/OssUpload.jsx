import React from "react";
import OSS from 'ali-oss';
import { Upload, Row, Col, Button, Tooltip, Modal, List, Progress, Divider, message } from 'antd';
import { CloseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Ajax, Viewer } from "../../index";
import './index.less';

class OssUpload extends Viewer {
  constructor(p) {
    super(p);
    this.state = {
      isBeforeUploadExecuted: false,
      fileListStatus: [],
      ossOption: {},
      attachmentVisible: false,
      loading: false,
      keyPath: '',
      resList: (super.getValue() || []).map((item, index) => {
        if (!item.uid) item.uid = index
        return item
      })
    }
    this.options = Object.assign({
      changeHandle: () => { },
      resFormat: res => res,
      srcFormat: src => src,
      maxAmount: 50,
      maxSize: 1000,
      checkSame: false,
      multipartUploadConf: {
        parallel: 3,
        partSize: 1024 * 1024 * 2,
        timeout: 30000,
      }
    }, p.schema.props)
  }

  changeFileList = (list) => {
    console.log('changeFileList', list)
    this.setState({
      resList: list
    })
    super.changeValue(list)
  }

  componentDidMount() {
    const { oss_upload_token } = this.options
    if (oss_upload_token) {
      const createOss = () => {
        if (oss_upload_token) {
          // 该接口需要返回 OSS 的实例化配置信息
          Ajax.get(oss_upload_token.url, oss_upload_token.params).then(({ data }) => {
            console.log('oss_upload_token', data)
            this.setState({ keyPath: data.keyPath })
            this._client = new OSS({
              ...data,
              stsToken: data.securityToken
            })
          })
        }
      };
      createOss();
      // 保持 oss 连接
      this._timer = window.setInterval(createOss, 55 * 60 * 1000);
    }
  }

  cancleUpload = () => {
    if (this._client) this._client.cancel();
    this.endUpload()
  }

  startUpload() {
    this.setState({ loading: true });
    // 留下上传中的标记，为了实现上传中无法提交
    localStorage["m3-plugin-ossupload-loading"] = true
  }

  endUpload() {
    this.setState({ loading: false });
    delete localStorage["m3-plugin-ossupload-loading"]
  }

  componentWillUnmount() {
    window.clearInterval(this._timer);
    // 关闭页面的时候取消上传
    this.cancleUpload();
    this._client = null
  }

  onRemove = (file) => {
    const list = this.state.resList?.filter(i => file.uid !== i.uid)
    this.changeFileList(list)
  }

  // 自动断点续传
  upload = (name, file, config) => {
    const { multipartUploadConf } = this.options
    const { fileListStatus, resList, keyPath } = this.state
    return this._client.multipartUpload(name, file, config)
      .then(res => {
        // 当所有文件上传完成后，记录了到结果，并取消loading
        if (fileListStatus.every(e => e.percent == 100)) {
          const addArr = fileListStatus.map(ele => {
            const r = ele.file
            r.keyPath = `${keyPath}/${ele.file.name}`
            return r
          })
          this.changeFileList([...resList, ...addArr]);
          this.endUpload()
        }
      })
      .catch(async e => {
        if (e && e.name && e.name === 'cancel') {
          return
        } else {
          const current = fileListStatus.find(item => item.file.uid === file.uid)
          if (current.count <= 100) {
            this.setState({
              fileListStatus: fileListStatus.map(item => {
                if (item.file.uid === file.uid) {
                  item.count = item.count + 1;
                }
                return item
              })
            })
            // 自动续传
            this.upload(name, file, {
              progress: (p, checkpoint) => this.progress(p, checkpoint, file),
              checkpoint: current.checkpoint,
              ...multipartUploadConf
            })
          } else {
            this.setState({
              fileListStatus: fileListStatus.map(item => {
                if (item.file.uid === file.uid) {
                  item.breakName = name;
                  item.breakFile = file;
                  item.status = 'exception';
                }
                return item
              })
            })
          }
        }
      });
  }

  // 进度条
  progress = (p, checkpoint, file) => {
    const { fileListStatus } = this.state
    this.setState({
      fileListStatus: fileListStatus.map(item => {
        if (item.file.uid === file.uid) {
          item.percent = Math.floor(p * 100)
          item.checkpoint = checkpoint
        }
        return item
      })
    })
    return function (done) {
      done();
    };
  }

  element() {
    const { multiple = false, accept = '', multipartUploadConf, maxSize, maxAmount, showSize = false, checkSame } = this.options
    const { loading, fileListStatus, keyPath, attachmentVisible, resList } = this.state

    // 上传配置
    const uploadProps = {
      multiple,
      accept,
      onRemove: this.onRemove,
      customRequest: async ({ file }) => {
        // 一个个上传的
        console.log('customRequest->fileList：', file)
        await this.upload(`${keyPath}/${file.name}`, file, {
          progress: (p, checkpoint) => this.progress(p, checkpoint, file),
          ...multipartUploadConf
        })
      },
      beforeUpload: (file, fileList) => {
        // 这里可以拿到上传的所有文件
        console.log('beforeUpload->fileList：', file, fileList)
        if (fileList.length >= maxAmount) {
          message.error(`已达到文件数量上限(${maxAmount}个)，请删除后上传`);
          return false
        }
        if (file.size > maxSize * 1024 * 1024) {
          message.error(`文件大小超过${maxSize}MB，请压缩后上传`);
          return false
        }
        if (checkSame && resList.findIndex(e => e.name == file.name) >= 0) {
          message.error(`存在同名文件，无法上传该文件`);
          return false
        }
        this.setState({
          fileListStatus: fileList.map(item => ({file: item, count: 1, percent: 0})),
          attachmentVisible: true,
        })
        
        this.startUpload()
      }
    };

    return (
      <div>
        <Upload disabled={loading} {...uploadProps} fileList={resList}>
          <Button disabled={loading} loading={loading}>点击上传</Button>
        </Upload>
        {/* 上传弹窗 */}
        <div
          className={'m3-plugin-ossupload-progress-modal'}
          style={{ visibility: attachmentVisible ? 'visible' : 'hidden', zIndex: 999 }}
        >
          <Row>
            <Col span={20}>附件上传</Col>
            <Col span={4} className={'cancel-icon'}>
              <CloseOutlined onClick={() => {
                if (this._client && loading) {
                  Modal.confirm({
                    content: '有文件正在上传中，关闭此窗口将中断文件上传！',
                    onText: '关闭',
                    maskClosable: false,
                    onOk: () => {
                      this.cancleUpload()
                      this.setState({
                        fileListStatus: [],
                        attachmentVisible: false
                      })
                    }
                  })
                } else {
                  this.setState({
                    fileListStatus: [],
                    attachmentVisible: false
                  })
                }
              }} />
            </Col>
          </Row>
          <Divider className={'divider'} />
          <div className={'progress-list'}>{
            fileListStatus && fileListStatus.length > 0 ?
              <List
                dataSource={fileListStatus}
                renderItem={item => {
                  return <div className={'upload-progress-box'}>
                    <div style={{ width: '110px' }}>
                      <Tooltip title={item.file.name}>
                        <span className={'file-name'}>{item.file.name}</span>
                      </Tooltip>
                    </div>
                    <div style={{ width: '230px', paddingLeft: '20px' }}>
                      <Progress
                        percent={item?.percent}
                        status={item?.status || ''}
                      />
                    </div>
                    <span
                      style={{
                        width: '5px',
                        visibility: item.status === 'exception' ? 'visible' : 'hidden',
                        pointerEvents: item.status === 'exception' ? 'auto' : 'none',
                      }}
                      className='link-text'
                      onClick={() => {
                        if (item?.status === 'exception') {
                          item.status = ''
                          this.upload(item.breakName, item.breakFile, {
                            progress: (p, checkpoint) => this.progress(p, checkpoint, item.file),
                            checkpoint: item.checkpoint,
                            ...multipartUploadConf
                          })
                        }
                      }}
                    >
                      {
                        attachmentVisible && item.status === 'exception' && item.percent < 100 ? <CaretRightOutlined style={{ color: 'black', marginTop: '5px' }} /> : ' '
                      }
                    </span>
                  </div>
                }}
              /> : <div className={'none'}>暂无数据</div>
          }</div>
        </div>
      </div>
    )
  }
}

export default OssUpload
