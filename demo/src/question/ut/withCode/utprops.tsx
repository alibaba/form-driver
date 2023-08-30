/** 测试运行时schema / database 变化 */
import React, { useState } from 'react';
import { Switch } from 'antd';
import M3 from '../../../../../src/framework/M3';

const schema1 = {
	"name":"quest","type":"object",
	"objectFields":[
		{"label":"这是一个选择题","name":"t1","type":"set","editor":"ACheckBox", "required":true, "option":[{"value":1,"label":"A"},{"value":2,"label":"B"},{"value":3,"label":"C"}]}
	]
};
const schema2 = {
	"name":"quest","type":"object",
	"objectFields":[
		{"label":"這是一個選擇題","name":"t1","type":"set","editor":"ACheckBox", "option":[{"value":1,"label":"A"},{"value":2,"label":"B"},{"value":3,"label":"C"},{"value":4,"label":"D"}]}
	]
};
const database1 = {t1: [2]}
const database2 = {t1: [1]}

export function UtProps() {
	const [database, setDatabase] = useState(database1)
	const [schema, setSchema] = useState<any>(schema1)

	return <>
		<Switch defaultChecked checkedChildren="database1" unCheckedChildren="database2" onChange={(b) => {
			if(b) {
				setDatabase(database1)
			} else {
				setDatabase(database2)
			}
		}} />
		<Switch defaultChecked checkedChildren="简体" unCheckedChildren="繁体" onChange={(b) => {
			if(b) {
				setSchema(schema1)
			} else {
				setSchema(schema2)
			}
		}} />
		<M3 database={database} schema={schema} morph="editor"/>
	</>
}
