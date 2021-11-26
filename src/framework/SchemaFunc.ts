import _ from 'lodash';
import { ValueConst } from './Schema';

/**
 * schema里可以使用的函数都定义在这里
 */
export const SchemaFunc = {
	/**
	 * 是否选中shouldSelected中的某个选项.
	 * 
	 * @param v 适用于enum/set/string/int
	 * @param shouldSelected 选中值
	 * @returns 
	 */
	is(v:any|any[], shouldSelected:ValueConst | ValueConst[]) {
		if(_.isArray(v)) {
			if(_.isArray(shouldSelected)) {
				return _.intersection(v, shouldSelected).length > 0
			} else {
				return _.indexOf(v, shouldSelected) >= 0
			}
		} else {
			if(_.isArray(shouldSelected)) {
				return _.indexOf(shouldSelected, v) >= 0
			} else {
				return v === shouldSelected
			}
		}
	}
}