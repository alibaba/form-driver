import React from "react";
import "./Segment.less";

interface Prop {
  style?: React.CSSProperties,
  mainTitle?: React.ReactNode,
  /** 副标题 */
  subTitle?: React.ReactNode,
  /** 右上角的按钮 */
  topRight?: React.ReactNode,

  /** label的name，可以用于query到dom定位 */
  labelName?: string;

  /** 分栏数 */
  column?: number;
}

export class Segment extends React.Component<Prop, any> {
  render() {
    return <div style={this.props.style} className="AForm_segment">
      <div className="AForm_segmentTitleBar" key="分段标题" {... { name: this.props.labelName }}>
        {this.props.topRight ? <span className="AForm_segmentTopRight">{this.props.topRight}</span> : undefined}
        {this.props.mainTitle ? <span className="AForm_segmentMainTitle">{this.props.mainTitle}</span> : undefined}
        {this.props.subTitle ? <span className="AForm_segmentSubTitle">{this.props.subTitle}</span> : undefined}
      </div>
      {
        this.props.column > 1 ?
          <div className="AForm" style={{
            display: 'flex',
            flexFlow: 'row wrap',
            alignContent: 'flex-start',
          }}>
            {this.props.children}
          </div>
          : this.props.children
      }
    </div>
  }
}
