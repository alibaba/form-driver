import React from "react";
import { Viewer, ViewerState } from 'form-driver';
import './RichViewer.less'

interface State extends ViewerState {
  isShow: boolean,
}

export class RichViewer extends Viewer<State> {
  private options: any;

  constructor(p: any) {
    super(p);

    this.options = Object.assign({
      srcFormat: src => src
    }, this.props.schema.options)
    console.log('this.options', this.options)
    console.log('this.getValue()', this.getValue())

    this.state = {
      ctrlVersion: 1,
      noValidate: false,
      isShow: false,
    };
  }

  element() {
    const d = this.getValue()
    const { isShow } = this.state
    if (d.more) {
      return <div className="form-driver-plugin-richtext-viewer-wrap">
        <div className={'ql-editor'} style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: d.HTML }} />
        {isShow ? <div className={'ql-editor'} style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: d.HTML2 }} /> : null}
        <div className="richtext-viewer-more">
          <span onClick={() => {
            this.setState({ isShow: !isShow })
          }}>{isShow ? '收起' : '展开'}{isShow ? <i className="u-arrow u-arrow-up">
          </i> : <i className="u-arrow u-arrow-down ">
          </i>}</span>
        </div>
      </div>
    } else {
      return <div className={'ql-editor'} style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: this.options.srcFormat(this.getValue()) }} />
    }
  }
}
