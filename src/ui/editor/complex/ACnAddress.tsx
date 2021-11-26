
import React from "react";
import { Input } from 'antd';
import { AGB2260 } from "../basic/AGB2260";
import './ACnAddress.less';
import { AInputBox } from "../basic/AInputBox";
import _ from "lodash";
import { BaseViewer } from '../../BaseViewer';
import { MUtil } from '../../../framework/MUtil';
import { MGB2260Type } from '../../../types/MGB2260Type';

/**
 * 国内地址，用以编辑省市区和详细地址
 * 数据类似{province:"陕西省",city:"西安市",district:"长安区", address:"紫薇田园都市A区", code:610116}
 */
export class ACnAddress extends BaseViewer {
  element() {
    const gb2260 = super.getValue() ?? {};
    // 当传入的 database，没有 code，但有 province 时，反查 code 
    if (gb2260.province && !gb2260.code) {
      for (const p of MGB2260Type.gb2260) {
        if (p.label === gb2260.province) {
          if (gb2260.city && p.children) {
            for (const c of p.children) {
              if (c.label === gb2260.city) {
                if (gb2260.district && c.children) {
                  for (const d of c.children) {
                    if (d.label === gb2260.district) {
                      gb2260.code = d.value
                      break
                    }
                  }
                } else {
                  gb2260.code = c.value
                  break
                }
              }
            }
          } else {
            gb2260.code = p.value
            break
          }
        }
      }
    }
    return <Input.Group compact key={this.props.path} className={MUtil.phoneLike() ? "ACnAddress_p" : "ACnAddress"}>
      <AGB2260 morph="editor" schema={{ type: "gb2260", placeholder: super.getPlaceholder(0) }} database={gb2260} path={"code"} disable={this.props.disable} afterChange={(path, code, final):void => {
        const info = MGB2260Type.lookup(code);
        if (info) {
          _.set(gb2260, "province", info.label[0]);
          _.set(gb2260, "city", info.label[1]);
          _.set(gb2260, "district", info.label[2]);
        }
        super.changeValueEx(gb2260, false, final);
      }} />
      <AInputBox morph="editor" schema={{ type: "string", placeholder: super.getPlaceholder(1) }} database={this.props.database} path={this.props.path + ".address"} disable={this.props.disable} afterChange={(path, v, final)=>{
        super.changeValueEx(gb2260, false, final);
      }} />
    </Input.Group>
  }
}
