import './oa_shared';

import { OpenAssessmentEditor } from './studio/oa_edit';

window.tinyMCE.baseURL = baseUrl + "navoica-theme/js/vendor/tinymce/js/tinymce";
window.tinyMCE.suffix = ".min";

window.OpenAssessmentEditor = OpenAssessmentEditor;
