import React from "react";
import { MProp } from './Schema';
import { MUtil } from './MUtil';
import { assembly } from './Assembly';
import { MContext } from './MContext';

/**
 * 一个字段的视图
 */
export class MFieldViewer extends React.Component<MProp, any> {
  render() {
    const viewer = assembly.getViewerOf(this.props.schema, this.props.morph);
    if (!viewer) {
      return MUtil.error(`字段的视图尚未实现`, this.props.schema);
    }
    const props = {
      afterChange: () => { }, // 给afterChange一个默认值
      changeSchema: () => { },  // 给changeSchema一个默认值
      name: this.props.path,
      ...this.props
    };
    console.log('MFieldViewer.changeSchema', this.props.changeSchema, this.props.schema);

    const ele = React.createElement(viewer, props, null);

    return <MContext.Consumer>
      {ctx => {
        if (ctx.rootProps.wrapper && this.props.schema.type !== 'object' && this.props.schema.type !== 'array') {
          return ctx.rootProps.wrapper(ele, this.props.schema)
        } else {
          return ele
        }
      }}
    </MContext.Consumer>
  }
}
