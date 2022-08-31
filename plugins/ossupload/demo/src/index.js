import React from 'react';
import ReactDOM from 'react-dom';
import { injectTestCookie } from "./debug";
import { TestForm } from './TestForm';
import './index.css';
import 'antd/dist/antd.css';

injectTestCookie();

ReactDOM.render(
  <TestForm/>,
  document.getElementById('demo')
);