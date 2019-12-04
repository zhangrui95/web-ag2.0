import { stringify } from 'qs';
import request from '../utils/request';

//预警列表
export async function getLists(params) {
  return request(`${configUrl.serverUrl}/getJqYjXxPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
