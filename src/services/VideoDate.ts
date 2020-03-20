import request from '../utils/request';

export async function getList(params) {
  return request(`${configUrl.serverUrl}/getAudioAndVideoPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getJcjCount(params) {
  return request(`${configUrl.serverUrl}/getAudioAndVideoTJOfJcjPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getAjscCount(params) {
  return request(`${configUrl.serverUrl}/getAudioAndVideoTJOfAjPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getCqwscCount(params) {
  return request(`${configUrl.serverUrl}/getCqwscCount`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getDetail(params) {
  return request(`${configUrl.serverUrl}/getAudioAndVideoXqByid`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getGlJq(params) {
  return request(`${configUrl.serverUrl}/getJcjPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getGlAj(params) {
  return request(`${configUrl.serverUrl}/getCaseAllPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function addAudioVideoGL(params) {
  return request(`${configUrl.serverUrl}/addAudioVideoGL`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function delAudioAndVideoByid(params) {
  return request(`${configUrl.serverUrl}/delAudioAndVideoByid`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function cancelAudioVideoGL(params) {
  return request(`${configUrl.serverUrl}/cancelAudioVideoGL`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
