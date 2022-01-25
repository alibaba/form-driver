import { RichText } from './RichText';
import { RichType } from './RichType';
import { RichViewer } from './RichViewer';

export default {
  name: 'rich',
  type: RichType,
  editor: RichText,
  readable: RichViewer
}