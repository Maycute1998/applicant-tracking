import FolderIcon from '@mui/icons-material/Folder';
import ArticleIcon from '@mui/icons-material/Article';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import CodeIcon from '@mui/icons-material/Code';
const GoogleDriveMimeTypeMapping = (mimeType: string) => {
  switch (mimeType) {
    case 'application/vnd.google-apps.folder':
      return <FolderIcon />
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <ArticleIcon />
    case 'application/vnd.oasis.opendocument.text':
      return <ArticleIcon />
    case 'application/rtf':
      return <ArticleIcon />
    case 'application/pdf':
      return <PictureAsPdfIcon />
    case 'text/plain':
      return <ArticleIcon />
    case 'application/zip':
      return <FolderZipIcon />
    case 'application/epub+zip':
      return <ArticleIcon />
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return <ArticleIcon />
    case 'application/x-vnd.oasis.opendocument.spreadsheet':
      return <ArticleIcon />
    case 'text/csv':
      return <ArticleIcon />
    case 'text/tab-separated-values':
      return <ArticleIcon />
    case 'application/vnd.oasis.opendocument.presentation':
      return <ArticleIcon />
    case 'image/jpeg':
      return <ImageIcon />
    case 'image/png':
      return <ImageIcon />
    case 'image/svg+xml':
      return <IntegrationInstructionsIcon />
    case 'application/vnd.google-apps.script+json':
      return <CodeIcon />
  }
}
export { GoogleDriveMimeTypeMapping }
