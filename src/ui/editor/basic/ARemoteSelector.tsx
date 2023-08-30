
import React from "react";
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { Viewer, ViewerState } from '../../BaseViewer';
import { Ajax } from '../../../framework/Ajax';
import _ from "lodash";
import { MUtil } from '../../../framework/MUtil';
import { MFieldSchema } from '../../../framework/Schema';

interface State extends ViewerState {
  candidate: any[],
  fetching: boolean,
  q: string;
}

// 这个Viewer可用的数据类型
const VALID_TYPES = {
  "vl":true,
  "array":true,
  "string":true // 仅保存value
};

export function labelExpr(d: any, remote: MFieldSchema["remote"]){
  let script = "const {" + _.keys(d).join(',') + "} = d; return " + remote.labelExpr;
  return new Function("d", "_", script)(d, _);
}

export class ARemoteSelector extends Viewer<State> {
  fetchCandidate: (key:string)=>void;

  constructor(props) {
    super(props);
    this.state = {candidate: undefined, fetching: false, q:""};
    this.fetchCandidate = debounce(q => {
      this.setState({ fetching: true });
      Ajax.get(this.props.schema.remote.url.replace("${q}", q))
        .then(
          d => {
            _.assign(this.props.schema, {
              _options: d
            })
            this.setState({ candidate: MUtil.get(d, this.props.schema.remote.dataPath), fetching: false })
          }
        );
    }, 500);
  }

  element() {
    const type = this.props.schema.type;
    if(!VALID_TYPES[type]){
      return MUtil.error("只适用类型" + Object.keys(VALID_TYPES).join(","), this.props.schema);
    }

    let defaultValue = super.getValue();
    if(type === "string"){
      defaultValue = {value: defaultValue, label: defaultValue};
    }

    let mode = undefined;
    if(type === "array") {
      if(!_.isArray(defaultValue)){ // 数据不对
        defaultValue = []; // 干掉
      }
      mode = "multiple"
    } else {
      if(_.isNil(defaultValue?.value)){
        defaultValue = undefined;
      }
    }
    
    const p = this.props.schema.props ?? {};
    const deepCloneP = _.cloneDeep(p)
    const selfDisabled = p.disabled
    delete deepCloneP.disabled
    const selfOnChange = p.onChange
    const preOnChange = p.preOnChange
    delete deepCloneP.onChange
    
    
    return <Select
      key={this.props.path}
      showSearch
      mode={mode}
      // mode={"multiple"}
      labelInValue
      defaultValue={defaultValue}
      placeholder={this.props.schema.placeholder}
      notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={this.fetchCandidate}
      style={{ width: '100%' }}
      onFocus={()=>{
        if(!this.state.candidate) {
          this.fetchCandidate("");
        }
      }}
      onChange={async (v: any) => {
        // 只对array生效
        const result = preOnChange ? await preOnChange(v) : null

        switch(type){
          case "vl":
            if (v) super.changeValue({value: (result ?? v).value, label: (result ?? v).label});
            else super.changeValue(null);
            break;
          case "array":
            if (v) super.changeValue(result || v.map(item => ({value: item.value, label: item.label})));
            else super.changeValue(null);
            break;
          case "string":
            if (v) super.changeValue(result || v.value);
            else super.changeValue(null);
            break;
        }
        selfOnChange && selfOnChange(v)
      }}
      {...deepCloneP}
      >
      {
        this.state.candidate?.map(d => {
          const v = MUtil.get(d, this.props.schema.remote.valuePath);
          return (
            <Select.Option 
              key={v} 
              value={v}
              disabled={d[selfDisabled]}
            >
                {labelExpr(d, this.props.schema.remote)}
            </Select.Option>)
        })
      }
    </Select>
  }
}
