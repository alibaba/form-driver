import React, { Component } from 'react';
// import GithubCorner from 'react-github-corner';
import Demo from './main';
import { Radio, Select, Switch, Slider } from 'antd';
import './index.css';

const Option = Select.Option;
class Root extends Component {
  state = {
    schemaName: 'simplest',
    column: 1,
    displayType: 'column',
    readOnly: false,
    database: {},
    labelWidth: 110,
  };

  onColumnNumberChange = value => {
    this.setState({ column: value });
  };

  onDisplayChange = value => {
    this.setState({
      displayType: value,
      showDescIcon: value === 'row',
    });
  };

  onReadOnlyChange = value => this.setState({ readOnly: value });

  onSchemaChange = e => {
    this.setState({ schemaName: e.target.value });
  };

  onLabelWidthChange = value => {
    this.setState({ labelWidth: value });
  };

  render() {
    const { showDescIcon, readOnly, labelWidth } = this.state;
    return (
      <div className="fr-playground">
        <div className="w-100 flex setting-container">
          <Radio.Group
            name="schemaName"
            defaultValue="simplest"
            className="w-50 flex items-center flex-wrap z-999"
            onChange={this.onSchemaChange}
          >
            <Radio value="simplest">最简样例</Radio>
            <Radio value="input">输入框</Radio>
            <Radio value="select">选择框</Radio>
            <Radio value="date">日期框</Radio>
            <Radio value="arrayGrid">矩阵输入框</Radio>
          </Radio.Group>
          <div className="w-50 flex items-center flex-wrap z-999">
            {/* <Select
              style={{ marginRight: 8, marginLeft: 24 }}
              onChange={this.onColumnNumberChange}
              defaultValue="1"
            >
              <Option value="1">一行一列</Option>
              <Option value="2">一行二列</Option>
              <Option value="3">一行三列</Option>
            </Select> */}
            {/* <Select
              style={{ marginRight: 8 }}
              onChange={this.onDisplayChange}
              defaultValue="column"
            >
              <Option value="column">上下排列</Option>
              <Option value="row">左右排列</Option>
            </Select> */}
            <Switch
              style={{ marginRight: 8 }}
              checkedChildren="编辑"
              onChange={this.onReadOnlyChange}
              unCheckedChildren="只读"
              checked={readOnly}
            />
            {/* <div style={{ width: 70 }}>标签宽度：</div> */}
            {/* <Slider
              style={{ width: 80 }}
              max={200}
              min={20}
              value={labelWidth}
              onChange={this.onLabelWidthChange}
            /> */}
          </div>
        </div>
        <Demo {...this.state} />
      </div>
    );
  }
}

export default Root;
