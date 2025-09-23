import React from "react";
import { Modal } from "antd";
import Checkbox from "../../widget/DIYCheckbox";
import SortDrag from "../../widget/SortDrag";
import _ from "lodash";
import { MUtil } from "../../../framework/MUtil";
import { BaseViewer, Viewer } from "../../BaseViewer";
import { MEnumField, MProp, ValueConst } from "../../../framework/Schema";
import { MSetType } from "../../../types/MSetType";
import { MFieldViewer } from "../../../framework/MFieldViewer";
import { assembly } from "../../../framework/Assembly";
import { ViewerState } from "../../BaseViewer";

// 扩展 ViewerState 接口
interface ACheckDragState extends ViewerState {
  data: any[];
}

function ACheckBoxLabel(field: MEnumField) {
  if (field.html) {
    return <div dangerouslySetInnerHTML={{ __html: field.html }} />;
  } else {
    return field.label ?? field.value;
  }
}

/**
 * 多选
 * 示例：{label:"1.13 除爱人/对象之外，目前和您一起生活的家庭成员包括(多选):",name:"familyAccompany",type:"set", option: "父亲 母亲 孩子 爱人/对象的父亲 爱人/对象的母亲 兄弟姐妹"},
 * 值：["孩子", "父亲"]
 */
export class ACheckDrag extends Viewer<ACheckDragState> {
  _enumFields: MEnumField[];
  _enumValues: ValueConst[];

  /** 这个是开放输入框的值 */
  _inputBoxValue: ValueConst;

  // 定时器
  timer: any;
  // 输入框 ref
  inputRef: React.RefObject<HTMLInputElement>;

  checkFields: MEnumField[];
  checkValues: ValueConst[];
  dataRef: any; // 选中数据的 Ref 版本，用于获取最新数据的，避免页面渲染

  constructor(p: MProp) {
    super(p);
    this.inputRef = React.createRef();
    this.timer = null;
    this._enumFields = MUtil.option(this.props.schema);
    this._enumValues = this._enumFields.map((e) => e.value);

    const openOpt = p.schema.openOption ?? p.schema.setOpen;
    if (openOpt) {
      this._inputBoxValue =
        _.first(_.difference(super.getValue(), this._enumValues)) ??
        assembly.types[openOpt.type].createDefaultValue(assembly, openOpt);
    }
    const initialCheckFields = openOpt
      ? [
          ...this._enumFields,

          {
            label: p.schema.openOption.label,
            value: this._inputBoxValue,
            remark: "openOption",
          },
        ]
      : this._enumFields;
    const initialCheckValues = openOpt
      ? [...this._enumValues, this._inputBoxValue]
      : this._enumValues;
    // 初始化扩展的状态，包含父类的基础状态和新增的 data 字段
    this.checkFields = initialCheckFields;
    this.checkValues = initialCheckValues;
    this.dataRef = [...(super.getValue() ?? [])];
    this.state = {
      ctrlVersion: 1,
      noValidate: false,
      data: [...(super.getValue() ?? [])], // 选中状态
    };
  }

  _createBr() {
    return this.props.schema.layoutHint == "h" ? undefined : (
      <div key={MUtil.unique()} />
    );
  }

  componentDidUpdate(
    prevProps: Readonly<MProp>,
    prevState: Readonly<ACheckDragState>,
    snapshot?: any
  ): void {
    setTimeout(() => {
      // console.log("DRAG: 组件更新", this.checkFields, this.state.data);
    }, 2000);
  }

  element(ctx) {
    let { data } = this.state;
    const values = [...(data ?? [])];
    const openIndex = MSetType.openValueIndex(this.props.schema, values);
    // console.log("选项顺序更换", {
    //   checkFields,
    //   data,
    //   values,
    //   qq: super.getValue(),
    // });
    let checkboxs: any[] = this.checkFields.map((m: any, index) => {
      const isShow = MUtil.isShow(
        this.props.database,
        ctx.rootProps.schema?.objectFields,
        m.showIf
      );
      if (!isShow) return null;

      const checkIndex = values?.findIndex((e) => e === m.value);
      if (m.remark === "openOption") {
        const key = this._inputBoxValue;
        const checked = values?.findIndex((e) => e === key);
        return [
          <Checkbox
            disabled={this.props.disable}
            key={"openOption"}
            checked={checked !== -1}
            checkedIcon={checked ? checked + 1 : 1}
            onChange={(e) => {
              const max = this.props.schema.max;
              if (max > 0 && e.target.checked) {
                const len = values ? values.length : 0;
                // 选择第 max + 1 项时，提示并组织
                if (len >= this.props.schema.max) {
                  Modal.info({
                    title: `此题最多只能选择 ${max} 项`,
                    okText: "确认",
                    icon: null,
                    centered: true,
                    cancelText: "",
                  });
                  return;
                }
              }
              const currentCheckValue = MSetType.change(
                e.target.checked,
                key,
                values,
                this.props.schema,
                true
              );
              // console.log("当前选中的数据ccc", currentCheckValue);
              this.dataRef = currentCheckValue;
              setTimeout(() => {
                super.changeValue(currentCheckValue);
                this.setState({
                  data: currentCheckValue,
                });
              }, 0);
            }}
          >
            <span style={{ marginRight: "10px" }}>
              {this.props.schema.openOption.label ?? "其他"}
            </span>
            <span
              onBlurCapture={(e) => {
                // console.log("输入框失去焦点", this.dataRef);
                setTimeout(() => {
                  super.changeValue(this.dataRef);
                  this.setState({
                    data: this.dataRef,
                  });
                }, 0);
              }}
            >
              <MFieldViewer
                morph={this.props.morph}
                schema={this.props.schema.openOption}
                database={this}
                path="_inputBoxValue"
                afterChange={(path: string, str: any, final: boolean) => {
                  const matchEnum = this.checkFields.find(
                    (e) => e.value === str && e.remark !== "openOption"
                  );
                  // console.log("输入框 afterChange", str, values, matchEnum);
                  if (matchEnum) {
                    // 不能让用户输入某个枚举值
                    this._inputBoxValue = "";
                    _.remove(values, (e) => !this.checkValues.includes(e));
                    if (!values.includes(str)) {
                      values.push(str);
                    }

                    queueMicrotask(() => {
                      super.changeValueEx(values, true, final);
                      this.setState({
                        data: values,
                      });
                    });
                  } else {
                    const idx = values.findIndex((v) => {
                      const index = this.checkFields
                        .filter((e) => e.remark !== "openOption")
                        .findIndex((e) => e.value === v);
                      if (index === -1) return true;
                    });
                    if (!_.isNil(idx) || str === "") {
                      this._inputBoxValue = str;
                      values[idx] = str;
                      this.dataRef = values;
                      this.checkFields = this.checkFields.map((e) =>
                        e.remark === "openOption" ? { ...e, value: str } : e
                      );
                      // console.log("输入框数据", {
                      //   values,
                      //   checkFields: this.checkFields,
                      //   dataRef: this.dataRef,
                      // });
                      MUtil.set(this.props.database, this.props.path, values);
                    }
                  }
                }}
                parent={this.props.schema}
                forceValid={false}
                disable={openIndex < 0}
                style={{ width: "inherit" }}
              />
            </span>
          </Checkbox>,
          this._createBr(),
        ];
      }

      return [
        <Checkbox
          key={m.value}
          disabled={this.props.disable}
          checkedIcon={checkIndex === -1 ? 1 : checkIndex + 1}
          checked={_.includes(values, m.value)}
          onChange={(e) => {
            const currentCheckValue = MSetType.change(
              e.target.checked,
              m.value,
              values,
              this.props.schema,
              true
            );
            // console.log("当前变化的 value", values, currentCheckValue);
            const max = this.props.schema.max;
            if (max > 0 && e.target.checked) {
              const len = values ? values.length : 0;
              // 选择第 max + 1 项时，提示并组织
              if (len >= this.props.schema.max) {
                Modal.info({
                  title: `此题最多只能选择 ${max} 项`,
                  okText: "确认",
                  icon: null,
                  centered: true,
                  cancelText: "",
                });
                return;
              }
            }
            this.dataRef = currentCheckValue;
            queueMicrotask(() => {
              super.changeValue(currentCheckValue);
              this.setState({
                data: currentCheckValue,
              });
            });
          }}
        >
          {ACheckBoxLabel(m)}
        </Checkbox>,
        this._createBr(),
      ];
    });

    // 定义更换数据源的方法
    const changeOriginDataSource = (newData) => {
      // console.log("新数据", newData);
      // 更新排序后的选项数据
      const sortedCheckFields = newData.map((item) => ({
        ...item,
        label: item.label,
        value: item.id,
      }));
      // 更新排序后的选中值（保持原有的选中状态）
      const sortedData = newData
        .filter((item) => item.isChecked)
        .map((item) => item.id);

      // 同时更新schema中的option顺序，以确保后续操作基于新的排序
      const newSchema = { ...this.props.schema };
      const isHaveOpenOption = sortedCheckFields.filter(
        (e) => e.remark === "openOption"
      );
      // console.log("isHaveOpenOption", isHaveOpenOption);
      newSchema.option = isHaveOpenOption
        ? sortedCheckFields?.filter((e) => e.remark !== "openOption")
        : sortedCheckFields;
      newSchema.openOption = isHaveOpenOption
        ? isHaveOpenOption[0]
        : newSchema.openOption;
      // 更新组件状态
      // console.log("DRAG: changeOriginDataSource 排序之后正常应该展示的数据", {
      //   sortedData,
      //   sortedCheckFields,
      //   newSchema,
      // });
      this.checkFields = sortedCheckFields;
      this.dataRef = sortedData;
      setTimeout(() => {
        this.setState({
          data: sortedData,
        });
        MUtil.set(this.props.database, this.props.path, sortedData);
      }, 0);
    };

    const sortList = (checkboxs ?? [])?.map((cpn, index) => {
      let checkFieldsValue;
      checkFieldsValue = this.checkFields[index]?.value;
      const isOpenOp = this.checkFields[index]?.remark === "openOption";
      if (isOpenOp) {
        checkFieldsValue = this._inputBoxValue;
      }
      // console.log("DRAG: 实际传递进如 SortDrag的数据", {
      //   data,
      //   dataRef: this.dataRef,
      //   checkFields: this.checkFields,
      //   schema: this.props.database,
      //   isOpenOp,
      //   openValue: this._inputBoxValue,
      // });

      return {
        isChecked: this.dataRef
          ? this.dataRef?.findIndex((e) => e === checkFieldsValue) !== -1
          : false,
        checkedIndex:
          this.dataRef?.findIndex((e) => e === checkFieldsValue) + 1,
        cpn,
        id: "" + checkFieldsValue,
        label: this.checkFields[index]?.label,
        remark: this.checkFields[index]?.remark,
      };
    });
    const finalSortList = sortList
      .filter((item) => item.isChecked)
      .sort((a, b) => a.checkedIndex - b.checkedIndex)
      .concat(sortList.filter((item) => !item.isChecked));
    return (
      <SortDrag
        key={MUtil.unique()}
        changeOriginDataSource={changeOriginDataSource}
        sortList={finalSortList}
      />
    );
  }
}
