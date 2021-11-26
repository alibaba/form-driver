import 'antd/dist/antd.css';
import 'antd-mobile/dist/antd-mobile.css';
import { Ajax } from './framework/Ajax';
import { M3UISpecSegmentItem, MFieldSchema, M3UISpec, MFieldSchemaAnonymity } from './framework/Schema';
import { MViewerDebug } from './framework/MViewerDebug';
import { MORPH, VIEWER, assembly, MTheme, Assembly } from './framework/Assembly';
import { ViewerState, Viewer, BaseViewer } from './ui/BaseViewer';
import { MViewer, SubmitBar, useM3Database } from './framework/MViewer';
import M3 from './framework/M3';
import { MFieldViewer } from './framework/MFieldViewer';
import { MContext } from './framework/MContext';
import { MUtil } from './framework/MUtil';
import { Segment } from "./ui/widget/Segment";
import { UnderlineInputBox } from './ui/widget/UnderlineInputBox';
import { SegmentEditSwitch, SegmentEditSwitchState } from './ui/widget/SegmentEditSwitch';
import { ensureM3 } from './framework/Init';
import Validator from './framework/Validator';
import { MType, EmtpyType, createDefaultValue } from './types/MType';

export {
  M3,
  MContext, MFieldViewer, BaseViewer, assembly, SegmentEditSwitch, Viewer, UnderlineInputBox, Segment, MUtil, Ajax,
  MViewer,
  MViewerDebug, SubmitBar,
  useM3Database,
  ensureM3,
  Validator,
  EmtpyType,
  createDefaultValue,
  Assembly
};
export type { M3UISpec, ViewerState, SegmentEditSwitchState, M3UISpecSegmentItem, MFieldSchema, MFieldSchemaAnonymity, MORPH, VIEWER, MType, MTheme };
export default M3;
