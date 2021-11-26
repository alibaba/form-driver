/** 测试运行时schema / database 变化 */
import React from 'react';
import M3 from '../../../../src/framework/M3';
import { SubmitBar } from '../../../../src/framework/MViewer';

const schema = {
	"name":"quest","type":"object",
	"objectFields":[
		{"label":"baddata1 数据是NaN     ","name":"baddata1","type":"int","required":true},
		{"label":"baddata2 数据是Infinity","name":"baddata2","type":"int","required":true}
	]
}
const database = {"baddata1": NaN, "baddata2": Infinity}

export function IntBadData() {
	return <M3 database={database} schema={schema} morph="editor">
		<SubmitBar/>
	</M3>
}
