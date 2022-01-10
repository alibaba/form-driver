import React from 'react';
import ReactDOM from 'react-dom';
import { injectTestCookie } from "./debug";
import { CreateCourse } from './CreateCourse';
import TestForm from './TestForm';
import TestForm2 from './TestForm2';
import { JZG } from './JZG';
import {UTDriver} from './ut/UTDriver';

import {tPage} from './ut_autoTest/tPage'

import './index.css';
import 'antd/dist/antd.css';
import 'antd-mobile/dist/antd-mobile.css';

import { MUtil } from '../../src';

injectTestCookie();

function App() {
  const q = MUtil.getQuery();
  const pages = [UTDriver,tPage, CreateCourse, TestForm, TestForm2, JZG];
  for(let p of pages){
    if(_.has(q, p.name)) {
      return React.createElement(p, {}, null);
    }
  }
  return <div style={{fontSize: 20}}>
    {pages.map(p=><div key={p.name}><a href={location.pathname + "?" + p.name}>{p.name}</a></div>)}
  </div>
}

ReactDOM.render(<App />, document.getElementById('demo'))
