

import _ from "lodash";
import React from "react";
import { assembly } from '../../framework/Assembly';
import { MFieldViewer } from "../../framework/MFieldViewer";
import { BaseViewer } from "../BaseViewer";

export class ArrayViewer extends BaseViewer {
  element(ctx) {
    const vs = this.getValue();
    if (_.isNil(vs)) {
      return <div>{assembly.theme.READABLE_BLANK}</div>
    } else if (!_.isArray(vs)) {
      return <div>{assembly.theme.READABLE_INVALID}</div>
    } else if (vs.length === 0) {
      return <div>{assembly.theme.READABLE_BLANK}</div>
    }

    if (this.props.schema.toReadable) {
      return <div>{assembly.toReadable(this.props.schema, vs, super.getParentValue())}</div>
    } else if (this.props.schema.remote) {
      return <div> {vs.map(v => v.label).join(", ")} </div>
    } else if (!this.props.schema.arrayMember) {
      return <div>{vs.join(', ')}</div>
    } else {
      if (this.props.schema.layoutHint === "h") {
        return <div style={{ display: 'flex' }}>
          {
            vs.map((v, index) => {
              const itemPath = this.props.path + "[" + index + "]";
              return <div style={{flex: 1}}>
                <MFieldViewer style={this.props.schema.arrayMember.style} morph={this.props.morph} key={itemPath} schema={this.props.schema.arrayMember} database={this.props.database} path={itemPath} />
              </div>
            })
          }
        </div>
      } else {
        return vs.map((v, index) => {
          const itemPath = this.props.path + "[" + index + "]";
          return <MFieldViewer style={this.props.schema.arrayMember.style} morph={this.props.morph} key={itemPath} schema={this.props.schema.arrayMember} database={this.props.database} path={itemPath} />;
        })
      }
    }
  }
}
