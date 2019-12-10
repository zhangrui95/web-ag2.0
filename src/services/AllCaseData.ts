import request from '../utils/request';

//刑事案件
export async function caseDatas(params) {
    return request(`${configUrl.serverUrl}/getXsAndXzAjxxPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}