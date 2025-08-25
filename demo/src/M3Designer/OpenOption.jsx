import React from "react";
import { BaseViewer, MUtil } from "../../../src";
import { Input, Checkbox } from "antd";
import "./OpenOption.less";

export class OpenOption extends BaseViewer {
  element() {
    const val = super.getValue();

    return (
      <Checkbox
        className="open-option-wraper"
        defaultChecked={!!val}
        onChange={(e) => {
          const res = e.target.checked;
          if (res) {
            super.changeValue({
              label: val?.label ?? "其他【请注明】",
              type: "string",
              value: MUtil.unique(),
            });
          } else {
            super.changeValue(undefined);
          }
        }}
      >
        <Input
          disabled={!val}
          defaultValue={val?.label ?? "其他【请注明】"}
          onChange={(e) => {
            const res = e.target.value;
            super.changeValue({
              label: res,
              type: "string",
            });
          }}
        ></Input>
      </Checkbox>
    );
  }
}
