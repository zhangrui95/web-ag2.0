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

// 删除在线学习的文件
export async function DeleteList(params) {
  return request(`${configUrl.serverUrl}/deleteZxxx`, {
    method: 'POST',
    data: params,
  });
}

// 文档格式转换
export async function FormatConvertService(params) {
  return request(`${configUrl.serverUrl}/getPdfPath`, {
    method: 'POST',
    data: params,
  });
}
