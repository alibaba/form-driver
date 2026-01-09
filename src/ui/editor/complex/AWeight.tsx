import { ReactNode, useState, memo } from "react";
import { BaseViewer, Viewer } from "../../BaseViewer";
import { MEnumField, MProp, ValueConst } from "../../../framework/Schema";
import { ViewerState } from "../../BaseViewer";
import { Slider, Row, Col, InputNumber } from "antd";
import { MUtil } from "../../../framework/MUtil";

export interface AWeightProps {
  /** 总比值，默认100 */
  total?: number;

  /** 是否允许小数，默认false只允许整数 */
  allowDecimal?: boolean;

  /** 小数位数，当allowDecimal为true时有效，默认1 */
  decimalPlaces?: number;

  /** 最小步长，默认1 */
  step?: number;

  /** 每个选项的最小比重，默认0 */
  minWeight?: number;

  /** 每个选项的最大比重，默认等于total */
  maxWeight?: number;

  /** 是否显示百分比符号，默认true */
  showPercentage?: boolean;

  /** 是否允许某些选项为0，默认true */
  allowZero?: boolean;
}

// 扩展 ViewerState 接口
interface AWeightState extends ViewerState {
  allSliderValues: any;
}

const mockOptions = [
  { label: "产品质量", value: "quality" },
  { label: "服务态度", value: "service" },
  { label: "价格水平", value: "price" },
  { label: "配送速度", value: "delivery" },
];

const mockData = {
  quality: 40,
  service: 30,
  price: 20,
  delivery: 10,
};

const InputSlider = memo((props: any) => {
  const { value, min, max, onChange: onCpnChange, onAfterChange } = props;

  const onChange = (newValue: number, isInputChange?: boolean) => {
    onCpnChange(newValue, isInputChange);
  };

  return (
    <Row gutter={[12, 12]}>
      <Col span={4}>
        <InputNumber
          style={{ width: "100%" }}
          min={min}
          max={max}
          value={value}
          onChange={(v) => onChange(v, true)}
          onBlur={onAfterChange}
        />
      </Col>
      <Col span={20}>
        <Slider
          min={min}
          max={max}
          marks={{ [min]: min, [max]: max }}
          onChange={onChange}
          onAfterChange={onAfterChange}
          value={typeof value === "number" ? value : 0}
        />
      </Col>
    </Row>
  );
});

export class AWeight extends Viewer<AWeightState> {
  _enumFields: MEnumField[];
  _enumValues: ValueConst[];
  allSliderValuesChanged: any = [];
  // 添加防抖定时器
  private debounceTimer: any = null;
  private lastUpdateTime: number = 0;
  private readonly THROTTLE_DELAY = 16; // 约 60fps
  private totalWeight: any = 0;
  private allValues: any = [];
  constructor(props: MProp) {
    console.log("AWeight props", props);
    super(props);
    const { schema } = props;
    this._enumFields = MUtil.option(this.props.schema);
    console.log("this._enumFields", this._enumFields);
    this.totalWeight = (schema as any).weight;
    this.allValues =
      super.getValue()?.map((i) => i.value) ??
      new Array(this._enumFields.length).fill(0);
    this.state = {
      allSliderValues: this.allValues,
      ctrlVersion: 1,
    };
  }

  componentDidMount(): void {
    console.log("滑动组件初始化");
    // const { cpnData } = this.state;
    // const allSliderValues = Object.values(cpnData);
    // this.setState({ allSliderValues });
  }

  componentDidUpdate(pre, cur): void {
    // console.log("当前数据88", super.getValue());
  }

  // 更新关联的滑动条
  private updateLinkedSliders(
    numbers: number[],
    currentIndex: number,
    isAfterChange?: boolean
  ): void {
    const newNumbers = [...numbers];
    const targetIndex = numbers.length - 1;
    const isSelectNumber = this.allSliderValuesChanged
      .slice(0, targetIndex)
      .every((changed) => changed);
    const totalData = numbers.reduce((total, current, index) => {
      if (index !== targetIndex) {
        total += current;
      }
      return total;
    }, 0);
    if (targetIndex !== -1 && currentIndex !== targetIndex && isSelectNumber) {
      const finalValue = this.totalWeight - totalData;
      console.log("totalData", totalData, finalValue);
      if (finalValue >= 0 && finalValue <= this.totalWeight) {
        // 使用插值算法平滑过渡
        const currentValue = numbers[targetIndex];
        const smoothedValue = isAfterChange
          ? finalValue
          : Math.floor(this.smoothValue(currentValue, finalValue, 0.3)); // 0.3 是平滑系数

        newNumbers[targetIndex] = smoothedValue;
        this.setState({
          allSliderValues: newNumbers,
        });
      } else {
        newNumbers[targetIndex] = 0;
        this.setState({
          allSliderValues: newNumbers,
        });
      }
    } else {
      // 如果不联动更新的情况下，那么就直接更新滑动条
      this.setState({
        allSliderValues: newNumbers,
      });
    }
    this.allSliderValuesChanged[currentIndex] = true;
    super.changeValue(
      newNumbers.map((n, index) => {
        return {
          label: this._enumFields[index].value,
          value: n,
        };
      })
    );
    console.log("更改后的 weight database", super.getValue());
  }

  // 平滑插值算法
  private smoothValue(current: number, target: number, factor: number): number {
    return current + (target - current) * factor;
  }

  element() {
    const hasAssignWeight = this.state.allSliderValues.reduce(
      (total, current) => total + current,
      0
    );
    return (
      <div style={{ padding: 16 }}>
        {this._enumFields.map((option, index) => {
          return (
            <div key={(option as any).value}>
              <div style={{ marginBottom: 8, fontWeight: "bold" }}>
                {option.label}
              </div>
              <InputSlider
                onChange={(value, isInputChange) => {
                  const numbers = [...this.state.allSliderValues];
                  numbers[index] = value;
                  super.changeValue(
                    numbers.map((n, index) => {
                      return {
                        label: this._enumFields[index].value,
                        value: n,
                      };
                    })
                  );

                  // 使用节流控制联动更新频率
                  const now = Date.now();
                  if (now - this.lastUpdateTime >= this.THROTTLE_DELAY) {
                    this.updateLinkedSliders(numbers, index, isInputChange);
                    this.lastUpdateTime = now;
                  } else {
                    // 使用防抖确保最后一次更新被执行
                    if (this.debounceTimer) {
                      clearTimeout(this.debounceTimer);
                    }
                    this.debounceTimer = setTimeout(() => {
                      this.updateLinkedSliders(numbers, index, isInputChange);
                      this.lastUpdateTime = Date.now();
                    }, this.THROTTLE_DELAY);
                  }
                }}
                value={this.state.allSliderValues[index]}
                onAfterChange={(value) => {
                  // 结束更新后，再重设一遍数据，确保数据的准确性
                  this.updateLinkedSliders(
                    this.state.allSliderValues,
                    index,
                    true
                  );
                }}
                max={this.totalWeight}
                min={0}
              />
            </div>
          );
        })}
        {this.totalWeight > 0 && this._enumFields.length > 0 ? (
          <div>
            提示：总比重必须为{this.totalWeight}，已分配比重：
            <span
              style={{
                color: hasAssignWeight > this.totalWeight ? "red" : "#000",
              }}
            >
              {hasAssignWeight}
              {hasAssignWeight > this.totalWeight ? `，请修改` : ""}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}
