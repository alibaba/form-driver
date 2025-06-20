import OssUpload from './OssUpload.jsx';
import OssUploadType from './OssUploadType';
import OssUploadViewer from './OssUploadViewer';

export default {
  name: 'ossupload',
  type: OssUploadType,
  editor: OssUpload,
  readable: OssUploadViewer
}