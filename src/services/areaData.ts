import request from '../utils/request';

export async function areaDatas(params) {
  return request(`${configUrl.serverUrl}/getBaqPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//详情
export async function areaDetail(params) {
  return request(`${configUrl.serverUrl}/getBaqXqById`, {
    method: 'POST',
    data: params,
  });
}

export async function problemAid(params) {
  return request(`${configUrl.serverUrl}/questionFqdb`, {
    method: 'POST',
    data: params,
  });
}

// 全部的轨迹视频
export async function AllVideo(params) {
  return request(`${configUrl.baqServerUrl}/mqtt/trackVideoPlay`, {
    method: 'POST',
    data: params,
  });
}

// 部分的轨迹视频
export async function PartVideo(params) {
  return request(`${configUrl.baqServerUrl}/mqtt/historicalVideo`, {
    method: 'POST',
    data: params,
  });
}

// 人员成分图表统计
export async function areaRYCFDatas(params) {
  return request(`${configUrl.serverUrl}/getBaqRyCfTbTj`, {
    method: 'POST',
    data: params,
  });
}

// 人员性别图表统计
export async function getAreaRYXb(params) {
  return request(`${configUrl.serverUrl}/getBaqRyXbTbTj`, {
    method: 'POST',
    data: params,
  });
}

// 人员成分图表特殊人员统计
export async function areaSpecialRYCFDatas(params) {
  return request(`${configUrl.serverUrl}/getBaqRyCfTsryTbTj`, {
    method: 'POST',
    data: params,
  });
}

// 年龄划分图表统计
export async function areaNLHFDatas(params) {
  return request(`${configUrl.serverUrl}/getBaqNlHfTbTj`, {
    method: 'POST',
    data: params,
  });
}

// 涉案人员入区人次图表统计
export async function areaSARYRQRCDatas(params) {
  return request(`${configUrl.serverUrl}/getBaqSaryRqrcTbTj`, {
    method: 'POST',
    data: params,
  });
}

// 人员类型图表统计
export async function areaSALXDatas(params) {
  return request(`${configUrl.serverUrl}/getBaqSalxTbTj`, {
    method: 'POST',
    data: params,
  });
}

// 入区原因图表统计
export async function areaRQYYDatas(params) {
  return request(`${configUrl.serverUrl}/getBaqRqyyTbTj`, {
    method: 'POST',
    data: params,
  });
}

// 入区人次趋势图表统计
export async function areaRQRCQSDatas(params) {
  return request(`${configUrl.serverUrl}/getBaqRqrcQsTbTj`, {
    method: 'POST',
    data: params,
  });
}
