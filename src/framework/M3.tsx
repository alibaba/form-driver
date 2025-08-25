import React, { useState, useEffect } from 'react';
import { M3Prop, MViewer } from './MViewer';
import { MViewerDebug } from './MViewerDebug';
import editorMap from './editorMap';
import { MFieldSchema, M3UISpec, MFieldSchemaAnonymity } from "../../src/framework/Schema";
import _ from "lodash";

// 外部 schema 转化为内部
function deal(fieldSchema: MFieldSchemaAnonymity | MFieldSchema) {
  if (fieldSchema.arrayMember) {
    deal(fieldSchema.arrayMember);
  } else if (fieldSchema.objectFields) {
    for (let f of fieldSchema.objectFields) {
      deal(f);
    }
  } else {
    let opt = fieldSchema.option ?? fieldSchema.setFields ?? fieldSchema.enumFields
    if (opt) {
      if (typeof opt === 'string') {
        fieldSchema.option = opt.split(" ").map(
          aEnum => {
            const kv = aEnum.split("=");
            return { label: kv[0], value: kv[1] ?? kv[0] };
          }
        );
      } else {
        fieldSchema.option = opt
      }
    }

    fieldSchema.openOption = fieldSchema.openOption ?? fieldSchema.setOpen ?? fieldSchema.enumOpen

    if (!fieldSchema.type && fieldSchema.editor) {
      Object.assign(fieldSchema, editorMap[fieldSchema.editor])
    }
  }
}

// 标准化 schema
function standardSchema(schema: MFieldSchema | MFieldSchema[], layout?: M3UISpec) {
  const _schema = _.cloneDeep(schema)
  if (_.isArray(_schema)) {
    _schema.forEach(item => {
      deal(item)
    })
    const temp: MFieldSchema = {
      name: '__root__',
      type: 'object',
      objectFields: _schema
    }
    if (layout) {
      temp.uispec = layout
    }
    return _.cloneDeep(temp)
  } else {
    deal(_schema)
    return _schema
  }
}

const M3 = (props: React.PropsWithChildren<M3Prop & { debug?: boolean }>) => {

  let [database, setDatabase] = useState(_.cloneDeep(props.database))
  let [schema, setSchema] = useState(standardSchema(props.schema))
  let [k, setK] = useState(0)

  // debug 属性为真 且 页面地址携带 debug 参数，开启调试模式
  let debug = props.debug || (window.location.search.indexOf("debug") >= 0 || window.location.hash.indexOf("debug") >= 0);

  const changeSchema = v => {
    // 如果传入的是部分 schema 更新（只包含当前字段的更新），则合并到现有 schema 中
    if (v && v.name) {
      // 查找并更新特定字段
      const updateSchemaField = (schema) => {
        if (schema.name === v.name) {
          return { ...schema, ...v };
        }
        
        if (schema.objectFields) {
          return {
            ...schema,
            objectFields: schema.objectFields.map(updateSchemaField)
          };
        }
        
        if (schema.arrayMember) {
          return {
            ...schema,
            arrayMember: updateSchemaField(schema.arrayMember)
          };
        }
        
        return schema;
      };
      
      const updatedSchema = updateSchemaField(schema);
      setSchema(standardSchema(updatedSchema));
    } else {
      // 完整 schema 替换
      setSchema(standardSchema(v));
    }
    
    setK(++k);
  }
  const changeDatabase = v => {
    setDatabase(_.cloneDeep(v))
    setK(++k)
  }

  if (props.form) {
    props.form.setSchema = changeSchema
    props.form.setDatabase = changeDatabase
    props.form.getSchema = () => schema
    props.form.getDatabase = () => database
  }

  useEffect(() => {
    changeDatabase(props.schema)
  }, [props.schema])

  useEffect(() => {
    changeDatabase(props.database)
  }, [props.database])

  return (
    debug ? <MViewerDebug key={k} {...props} database={database} schema={schema} changeSchema={changeSchema} changeDatabase={changeDatabase} /> :
      <MViewer key={k} {...props} database={database} schema={schema} changeSchema={changeSchema} changeDatabase={changeDatabase} />
  );
}

export default M3;

export function useForm() {
  return {
    setSchema: (v) => { },
    setDatabase: (v) => { },
    getSchema: () => { },
    getDatabase: () => { },
  }
}
