import { ADDRESS } from '../consts';
export function stringToFile(stringData: string, fileName: string, contentType: string) {
  const blob = new Blob([stringData], { type: contentType });
  return new File([blob], fileName);
}

export function ipfsUpload(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const queryargs = `stream-channels=true&progress=false`;
  return fetch(`${ADDRESS.IPFS}/add?${queryargs}`, {
    method: 'POST',
    body: formData,
    mode: 'cors',
    headers: {
      authorization: 'Basic ' + ADDRESS.AUTH_HEADER,
    },
  }).then((response) => {
    // 处理响应
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('上传失败');
    }
  });
}

export function ipfsCrustPins(cid: string) {
  return fetch('https://pin.crustcode.com/psa/pins', {
    method: 'POST',
    body: JSON.stringify({ cid: cid, name: "crust-xuxihai_"+Date.now() }),
    mode: 'cors',
    headers: {
      authorization: 'Bearer ' + ADDRESS.AUTH_HEADER,
      "content-type":"application/json",
    },
  }).then((response) => {
    // 处理响应
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Pin失败');
    }
  });
}
