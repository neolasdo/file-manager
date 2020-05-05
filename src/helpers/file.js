import fileType from "../consts/fileType";

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

export function getFileExtension(filePath) {
  let filenameExtension = filePath.replace(/^.*[\\/]/, '');
  filenameExtension = filenameExtension.split(/#|\?/g)[0];
  return (typeof filenameExtension !== undefined && filenameExtension.indexOf('.') !== -1) ? filenameExtension.split('.').pop().toLowerCase() : false;
}

export function isDocumentFile(filePath) {
  return getFileExtension(filePath) && fileType.offices.includes(getFileExtension(filePath))
}

export function isImageFile(filePath) {
  return getFileExtension(filePath) && fileType.images.includes(getFileExtension(filePath))
}

export function canPreview(filePath) {
  return isDocumentFile(filePath) || isImageFile(filePath)
}

export function allFileTypes() {
  let types = fileType.offices.concat(fileType.images);
  let allTypes = [];
  types.forEach((item) => {
    allTypes.push({
      text: item.toUpperCase(),
      value: item
    })
  })
  return allTypes;
}
