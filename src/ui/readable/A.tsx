import _ from "lodash";
import React from "react";
import { MFieldSchema } from "../..";
import { assembly } from "../../framework/Assembly";
import { MUtil } from "../../framework/MUtil";
import { BaseViewer } from '../BaseViewer';

export class A extends BaseViewer {
  element() {
    const schema = this.props.schema as MFieldSchema;
    const { urlExpr, labelExpr, onClick } = schema.a;
    const value = super.getValue();
    const parent = super.getParentValue();

    let label;
    let href;
    if (_.isNil(value)) {
      label = assembly.theme.READABLE_BLANK
    } else {
      label = labelExpr
        ? MUtil.evalExprOrFunction(labelExpr, ["value", schema.name, "parent", "_"], [value, value, parent, _], value?.toString())
        : assembly.toReadable(schema, value, parent);
      href = MUtil.evalExprOrFunction(urlExpr, ["value", schema.name, "parent", "_"], [value, value, parent, _], undefined);
    }
    const target = schema.a.currentPage ? undefined : "_blank";
    return <a
      style={this.props.schema.style}
      className="wrap"
      onClick={() => onClick?.(value, parent)}
      href={href}
      target={target}>{label}</a>
  }
}
