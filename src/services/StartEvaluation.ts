import request from '../utils/request';


// 保存添加的题目
export async function EvaluateLabelService(params) {
  return request(`${configUrl.serverUrl}/getSscp`, {
    method: 'POST',
    data: params,
  });
}


