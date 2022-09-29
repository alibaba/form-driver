import OssUpload from './OssUpload.jsx';
import OssUploadType from './OssUploadType';
import OssUploadViewer from './OssUploadViewer';

export default {
  name: 'attachment',
  type: OssUploadType,
  editor: OssUpload,
  readable: OssUploadViewer
}