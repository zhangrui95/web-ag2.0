import request from '../utils/request';

export async function getList(params) {
  return request(`${configUrl.serverUrl}/getList`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getJcjCount(params) {
  return request(`${configUrl.serverUrl}/getJcjCount`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getAjscCount(params) {
  return request(`${configUrl.serverUrl}/getAjscCount`, {
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
  return request(`${configUrl.serverUrl}/getDetail`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
