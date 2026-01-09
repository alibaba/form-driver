import { MUtil } from "../framework/MUtil";
import { MFieldSchemaAnonymity, MValidationResult } from "../framework/Schema";
import { MType } from "./MType";

import { validateRequired } from "../framework/Validator";
import { assembly, Assembly } from "../framework/Assembly";
import _ from "lodash";

// 验证比重值的合法性
function validateWeightValue(
  a: Assembly,
  schema: any,
  value: any,
  path: string
): MValidationResult {
  if (_.isNil(value)) {
    return undefined;
  }

  if (!_.isObject(value)) {
    return { message: "比重值格式错误", path };
  }

  const fs = MUtil.option(schema) as any;
  const totalWeight = schema.weight ?? 100; // 默认总比重为100
  let currentTotal = 0;

  // 计算当前已分配比重
  if (Array.isArray(value)) {
    currentTotal = value?.reduce?.((acc, val) => acc + val.value, 0);
  }

  // 比重题的校验文案都是固定显示在表单上，所以返回的 message 都是空的
  // 验证总比重是否小于目标值
  if (schema.weight && currentTotal < schema.weight && currentTotal !== 0) {
    return {
      message: `已分配比重不得小于总比重`,
      path,
    };
  }

  // 验证总比重是否超过最大值
  if (schema.weight !== undefined && currentTotal > schema.weight) {
    return {
      message: ``,
      path,
    };
  }
  console.log("验证参数", value, currentTotal, schema.weight);

  return undefined;
}

export const MWeightType: MType = {
  validators: [validateRequired, validateWeightValue],

  toReadable: (
    assembly: Assembly,
    s: MFieldSchemaAnonymity,
    vs: any
  ): string => {
    const fs = MUtil.option(s) as any;
    if (_.isNil(vs)) {
      return assembly.theme.READABLE_BLANK;
    } else if (!_.isObject(vs)) {
      return assembly.theme.READABLE_ERROR;
    }

    const parts: string[] = [];
    for (let f of fs) {
      const weight = vs[f.value];
      if (!_.isNil(weight) && weight !== 0) {
        parts.push(`${f.label}: ${weight}`);
      }
    }

    return parts.length > 0 ? parts.join(", ") : assembly.theme.READABLE_BLANK;
  },

  standardValue: (a: Assembly, s: any, vs: any, strict: boolean): any => {
    if (!_.isObject(vs)) {
      return s.defaultValue;
    }
    if (!strict) {
      return vs;
    }

    const fs = MUtil.option(s) as any;
    const result: any = {};

    for (let f of fs) {
      const weight = vs[f.value];
      if (!_.isNil(weight) && _.isNumber(weight) && weight >= 0) {
        // 如果要求整数，则转换为整数
        if (s.requireInteger) {
          result[f.value] = Math.round(weight);
        } else {
          result[f.value] = weight;
        }
      }
    }

    return result;
  },

  createDefaultValue: (assembly: Assembly, s: MFieldSchemaAnonymity): any => {
    if (s.defaultValue) {
      return _.clone(s.defaultValue);
    } else {
      return {}; // 默认为空对象
    }
  },
};
