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

export function getFileExtension(filename) {
  let filenameExtension = filename.replace(/^.*[\\/]/, '');
  filenameExtension = filenameExtension.split(/#|\?/g)[0];
  return (typeof filenameExtension !== undefined && filenameExtension.indexOf('.') !== -1) ? filenameExtension.split('.').pop().toLowerCase() : false;
}

export function isDocumentFile(filename) {
  return getFileExtension(filename) && fileType.offices.includes(getFileExtension(filename))
}

export function isImageFile(filename) {
  return getFileExtension(filename) && fileType.images.includes(getFileExtension(filename))
}

export function isVideoFile(filename) {
  return getFileExtension(filename) && fileType.videos.includes(getFileExtension(filename))
}

export function canPreview(filename) {
  return isDocumentFile(filename) || isImageFile(filename) || isVideoFile(filename)
}

export function allFileTypes() {
  let types = fileType.offices.concat(fileType.images, fileType.videos);
  let allTypes = [];
  types.forEach((item) => {
    allTypes.push({
      text: item.toUpperCase(),
      value: item
    })
  })
  return allTypes;
}
