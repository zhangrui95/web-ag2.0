import request from '../utils/request';


// // 获取文件列表
// export async function LearningList(params) {
//   return request(`${configUrl.serverUrl}/getZxxxPgListPage`, {
//     method: 'POST',
//     data: params,
//   });
// }
//
// // 在线学习内容保存
// export async function InsertList(params) {
//   return request(`${configUrl.serverUrl}/insertZxxx`, {
//     method: 'POST',
//     data: params,
//   });
// }
//
// // 删除在线学习的文件
// export async function DeleteList(params) {
//   return request(`${configUrl.serverUrl}/deleteZxxx`, {
//     method: 'POST',
//     data: params,
//   });
// }
//
// // 文档格式转换
// export async function FormatConvertService(params) {
//   return request(`${configUrl.serverUrl}/getPdfPath2`, {
//     method: 'POST',
//     data: params,
//   });
// }

// 保存添加的题目
export async function SaveQuestion(params) {
  return request(`${configUrl.serverUrl}/saveTkxx`, {
    method: 'POST',
    data: params,
  });
}

// 获取题目列表
export async function QuestionList(params) {
  return request(`${configUrl.serverUrl}/getTkxxPgListPage`, {
    method: 'POST',
    data: params,
  });
}
// 删除题目
export async function DeleteQuestion(params) {
  return request(`${configUrl.serverUrl}/deleteTkxx`, {
    method: 'POST',
    data: params,
  });
}
// 保存添加的模板
export async function SaveTemplate(params) {
  return request(`${configUrl.serverUrl}/saveCpmb`, {
    method: 'POST',
    data: params,
  });
}
// 获取模板列表
export async function TemplateList(params) {
  return request(`${configUrl.serverUrl}/getCpmbPgListPage`, {
    method: 'POST',
    data: params,
  });
}
// 获取模板详情
export async function TemplateDetail(params) {
  return request(`${configUrl.serverUrl}/getCpmbXqById`, {
    method: 'POST',
    data: params,
  });
}
// 删除模板
export async function DeleteTemplate(params) {
  return request(`${configUrl.serverUrl}/deleteCpmb`, {
    method: 'POST',
    data: params,
  });
}
