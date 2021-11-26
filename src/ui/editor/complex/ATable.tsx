
import React from "react";
import { BaseViewer } from '../../BaseViewer';
import { MUtil } from "../../../framework/MUtil";
import { Table } from 'antd';
import { MFieldViewer } from "../../../framework/MFieldViewer";
import "./ATable.less";

/**
 * antd的表格，用于展示对象数组
 */
export class ATable extends BaseViewer {
  element() {
    if(this.props.schema.type !== "array" || this.props.schema.arrayMember.type !== "object"){
      return MUtil.error("ATable只适用于对象数组", this.props.schema);
    }
    
    const columns = this.props.schema.arrayMember?.objectFields?.map(f=>{
      return {
        title: f.label,
        dataIndex: f.name,
        key: f.name,
        render: (value, row, idx) => {
          return <MFieldViewer schema={f} database={row} path={f.name} morph={this.props.morph}/>
        }
      }
    });

    let nextKey = 0;
    return <Table rowKey={()=>nextKey++} key={this.props.path} className="ATable"
      columns={columns} dataSource={super.getValue()} pagination={false} loading={!this.props.database}/>
  }
}