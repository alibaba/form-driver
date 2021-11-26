
import { MFieldSchemaAnonymity } from "../framework/Schema";
import { EmtpyType, MType} from "./MType";
import { validateRequired } from "../framework/Validator";
import { Assembly } from "../framework/Assembly";
import { MGB2260Type } from "./MGB2260Type";
import _ from "lodash";

export const MCnAddress: MType = _.assign({}, EmtpyType, {
  validators: [validateRequired],

  toReadable: (assembly:Assembly, s:MFieldSchemaAnonymity, vs:any):string => {
    if(!vs){
      return assembly.theme.READABLE_BLANK;
    }
    if(!vs?.code && !vs.province){
      return assembly.theme.READABLE_INVALID;
    }
    // 当传入的 database，没有 code，但有 province 时，反查 code 
    if (vs.province && !vs.code) {
      for (const p of MGB2260Type.gb2260) {
        if (p.label === vs.province) {
          if (vs.city && p.children) {
            for (const c of p.children) {
              if (c.label === vs.city) {
                if (vs.district && c.children) {
                  for (const d of c.children) {
                    if (d.label === vs.district) {
                      vs.code = d.value
                      break
                    }
                  }
                } else {
                  vs.code = c.value
                  break
                }
              }
            }
          } else {
            vs.code = p.value
            break
          }
        }
      }
    }
    
    const l = MGB2260Type.lookup(vs.code);
    if(!l){
      return assembly.theme.READABLE_INVALID;
    }

    return l.label.join("/") + "/" + (vs.address ?? assembly.theme.READABLE_BLANK);
  }
})
