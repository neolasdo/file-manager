export function formatSize(num, MAX) {
  let suffix, d = num;
  if ((d / 1073741824) >= 1) {
    d = d / 1073741824;
    d = MAX > 21474836480 ? Math.ceil(d) : d.toFixed(2);
    suffix = " GB"
  } else if ((d / 1048576) >= 1) {
    d = d / 1048576
    d = MAX > 20971520 ? Math.ceil(d) : d.toFixed(1)
    suffix = " MB";
  } else if ((d / 1024) >= 1) {
    d = d / 1024;
    d = MAX > 20480 ? Math.ceil(d) : d.toFixed(1)
    suffix = " KB";
  } else {
    d = Math.ceil(d);
    suffix = " Bytes";
  }
  return d + suffix;
}

export function isDocumentFile(file) {
  return [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ].includes(file.mime)
}

export function isImageFile(file) {
  return [
    'image/jpg',
    'image/jpeg',
    'image/png',
  ].includes(file.mime)
}

export function canPreview(file) {
  return isDocumentFile(file) || isImageFile(file)
}

export function getFileThumbnail(item) {
  switch (item.mime) {
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      return require('@/assets/doc.png')
    }
    case 'application/pdf':
      return require('@/assets/pdf.png')
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return require('@/assets/ppt.png')
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return require('@/assets/excel.png')
    case  'image/jpg':
    case 'image/jpeg':
    case 'image/png' :
      return require('@/assets/image.png')
    default:
      return require('@/assets/default.png')
  }
}
