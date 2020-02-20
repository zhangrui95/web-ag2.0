import request from '../utils/request';


// 获取文件列表
export async function LearningList(params) {
  return request(`${configUrl.serverUrl}/getZxxxPgListPage`, {
    method: 'POST',
    data: params,
  });
}

// 在线学习内容保存
export async function InsertList(params) {
  return request(`${configUrl.serverUrl}/insertZxxx`, {
    method: 'POST',
    data: params,
  });
}
