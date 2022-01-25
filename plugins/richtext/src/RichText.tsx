import React from "react";
import './RichText.less';
import 'quill/dist/quill.snow.css';
import { Viewer, ViewerState } from 'form-driver';
import _ from "lodash";
const Quill = require('quill');

var icons = Quill.import('ui/icons');
icons['undo'] = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M530.496 371.072h-6.144V234.368c0-51.136-29.312-72.448-65.472-43.328L122.816 461.376c-36.096 28.992-36.096 76.48 0.128 105.472l333.504 267.648c36.16 28.992 67.968-0.448 67.968-43.584v-144.256h50.496c145.856 0 257.152 62.976 325.248 184.576 13.376 22.08 27.456 17.28 27.456 0-2.944-216.576-186.368-460.16-397.12-460.16z" /></svg>';
icons['redo'] = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M493.056 371.2c-210.944 0-394.24 243.712-397.312 460.288 0 17.408 14.336 22.016 27.648 0 68.096-121.344 179.2-184.32 325.12-184.32h50.688v144.384c0 43.008 31.744 72.704 68.096 43.52l333.312-267.776c36.352-29.184 36.352-76.288 0-105.472l-335.872-270.336c-36.352-29.184-65.536-7.68-65.536 43.52v136.704l-6.144-0.512z" /></svg>';

/**
 * 生成 UUID
 */
function generateUUID() {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16)
  })
  return uuid
}

let fontSizeStyle = Quill.import('attributors/style/size')
fontSizeStyle.whitelist = ['12px', false, '16px', '20px', '24px', '36px']
Quill.register(fontSizeStyle, true)

const BlockEmbed = Quill.import('blots/block/embed');
class VideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('controls', value.controls);
    node.setAttribute('controlslist', 'nodownload');
    node.setAttribute('width', value.width);
    node.setAttribute('height', value.height);
    node.setAttribute('poster', value.poster || 'https://da.hupan.com/cdn/hupan/poster.jpg');
    node.setAttribute('webkit-playsinline', true);
    node.setAttribute('playsinline', true);
    node.setAttribute('x5-playsinline', true);
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      controls: node.getAttribute('controls'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    };
  }
}

VideoBlot.blotName = 'simpleVideo';
VideoBlot.tagName = 'video';
Quill.register(VideoBlot);

interface State extends ViewerState {
  quillEditorId: string,
}

/**
 * 基于 Quill 封装的富文本输入框
 */
export class RichText extends Viewer<State> {
  private _quill: any;
  private options: any;

  constructor(p: any) {
    super(p);

    this.options = Object.assign({
      changeHandle: () => { },
      resFormat: res => res,
      srcFormat: src => src
    }, this.props.schema.options)
    const uuid = generateUUID()
    this.state = {
      quillEditorId: `quill-editor-${uuid}`,
    };
  }

  componentDidMount() {
    const { quillEditorId } = this.state;
    const { quillOptions = {}, maxHeight, minHeight, changeHandle, resFormat, srcFormat } = this.options
    const toolbarHandlers = {
      undo: () => {
        this._quill.history.undo()
      },
      redo: () => {
        this._quill.history.redo()
      }
    }
    this._quill = new Quill(`#${quillEditorId}`, Object.assign({
      theme: 'snow',
      placeholder: '请点击此处开始编辑...',
      modules: {
        toolbar: {
          container: [{ size: fontSizeStyle.whitelist }, 'bold', 'italic', 'underline', 'strike', { 'align': [] }, { list: 'ordered' }, { list: 'bullet' }, { 'color': [] }, { 'background': [] }, 'link',
            'clean', 'undo', 'redo'
          ],
          handlers: toolbarHandlers
        }
      },
    }, quillOptions));
    const initValue = srcFormat(this.getValue())
    const contentId = document.getElementById(quillEditorId)

    if (initValue) this._quill.root.innerHTML = initValue;
    // @ts-ignore
    if (maxHeight) contentId.firstElementChild.style['max-height'] = maxHeight
    // @ts-ignore
    if (minHeight) contentId.firstElementChild.style['min-height'] = minHeight

    this._quill.on('text-change', (delta, oldDelta, source) => {
      const htmlStr = !this._quill.root.innerHTML || this._quill.root.innerHTML === '<p><br></p>' ? '' : this._quill.root.innerHTML
      this.changeValue(resFormat(htmlStr));
      changeHandle(resFormat(htmlStr));
    });

    this._quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      delta.ops = delta.ops.map(op => {
        return {
          insert: op.insert
        };
      });
      return delta;
    });
  }

  element() {
    const { quillEditorId } = this.state;

    return (
      <div className="form-driver-plugin-richtext-wrap" key='1'>
        <div>
          <div id={quillEditorId} className="form-driver-plugin-richtext-content" />
        </div>
      </div>
    );
  }
}

